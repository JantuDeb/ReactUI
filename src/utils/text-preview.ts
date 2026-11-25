/**
 * Helpers for safely presenting short content strings (question/answer titles, doubt titles,
 * table cells, tooltips) that may contain raw HTML markup and/or LaTeX math delimiters.
 *
 * NEVER inject these strings with dangerouslySetInnerHTML — they come from the database.
 * Use `toPlainPreview` for plain-text contexts, or `<InlineMarkdown />`
 * (src/react-markdown/inline-markdown.tsx) where a rich context allows rendered math.
 */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  middot: "·",
  deg: "°",
  times: "×",
  divide: "÷",
  laquo: "«",
  raquo: "»",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
}

/** Decode the small set of HTML entities that realistically show up in titles. */
export function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => safeFromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => safeFromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (match, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? match)
}

function safeFromCodePoint(code: number): string {
  if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return ""
  try {
    return String.fromCodePoint(code)
  } catch {
    return ""
  }
}

/**
 * Remove HTML tags without parsing/executing anything. Block-ish tags become a space so words
 * don't get glued together, and `<img>` degrades to its alt text (or an "[image]" placeholder).
 */
export function stripHtmlTags(input: string): string {
  return input
    .replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, " ")
    .replace(/<\s*img\b[^>]*>/gi, (tag) => {
      const alt = /\balt\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(tag)
      const text = alt?.[2] ?? alt?.[3] ?? alt?.[4] ?? ""
      return text.trim() ? ` ${text.trim()} ` : " [image] "
    })
    .replace(/<\s*br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]*>/g, " ")
}

/**
 * Strip LaTeX math delimiters and the noisiest TeX control sequences so the underlying
 * expression stays readable as text: `$x^{2} + 3$` -> `x^2 + 3`.
 */
export function stripLatex(input: string): string {
  return (
    input
      // $$...$$ and $...$ -> inner expression (also handles \( \) and \[ \])
      .replace(/\$\$([\s\S]*?)\$\$/g, "$1")
      .replace(/\$([^$]*)\$/g, "$1")
      .replace(/\\\(([\s\S]*?)\\\)/g, "$1")
      .replace(/\\\[([\s\S]*?)\\\]/g, "$1")
      // \text{...}, \mathrm{...} etc. -> inner text
      .replace(/\\(?:text|textbf|textit|mathrm|mathbf|mathit|operatorname)\s*\{([^{}]*)\}/g, "$1")
      // \frac{a}{b} -> a/b
      .replace(/\\d?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, "$1/$2")
      // \sqrt{a} -> √a
      .replace(/\\sqrt\s*\{([^{}]*)\}/g, "√$1")
      // remaining control sequences: \alpha, \Rightarrow, \\, ...
      .replace(/\\\\/g, " ")
      .replace(/\\[a-zA-Z]+\s*/g, " ")
      .replace(/\\([%$&#_{}])/g, "$1")
      // leftover grouping braces around single tokens: x^{2} -> x^2
      .replace(/\{([^{}]*)\}/g, "$1")
      .replace(/[{}]/g, "")
  )
}

/** Strip the markdown syntax that would otherwise show up as literal punctuation. */
function stripMarkdown(input: string): string {
  return (
    input
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`([^`]*)`/g, "$1")
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, (_, alt: string) => (alt.trim() ? alt : "[image]"))
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/^\s{0,3}#{1,6}\s+/gm, "")
      .replace(/^\s{0,3}>\s?/gm, "")
      .replace(/(\*\*\*|___)(.*?)\1/g, "$2")
      .replace(/(\*\*|__)(.*?)\1/g, "$2")
      .replace(/(\*|_)(?=\S)(.*?\S)\1/g, "$2")
      .replace(/~~(.*?)~~/g, "$1")
  )
}

/** Collapse all whitespace (including newlines) into single spaces and trim. */
export function collapseWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim()
}

/** Truncate at a word boundary when possible, appending an ellipsis. */
export function truncate(input: string, maxLength: number): string {
  if (maxLength <= 0 || input.length <= maxLength) return input
  const slice = input.slice(0, maxLength)
  const lastSpace = slice.lastIndexOf(" ")
  const cut = lastSpace > maxLength * 0.6 ? slice.slice(0, lastSpace) : slice
  return `${cut.replace(/[\s.,;:!?-]+$/, "")}…`
}

export interface PlainPreviewOptions {
  /** Truncate the result to at most this many characters (word-boundary aware). */
  maxLength?: number
  /** Value returned when the input is empty/whitespace only. Defaults to "". */
  fallback?: string
}

/**
 * Turn an arbitrary title/short-content string into a readable single-line plain-text preview:
 * HTML tags removed, entities decoded, markdown + LaTeX delimiters stripped, whitespace collapsed.
 *
 * Safe for rendering as a React text child, a `title=` attribute, or a table cell.
 */
export function toPlainPreview(input?: string | null, options: PlainPreviewOptions = {}): string {
  const { maxLength, fallback = "" } = options
  if (!input) return fallback

  // Decode first so entity-encoded markup (&lt;img ...&gt;) is stripped too, then decode again
  // for entities that were themselves inside tags/attributes.
  let text = stripHtmlTags(decodeHtmlEntities(input))
  text = stripHtmlTags(decodeHtmlEntities(text))
  text = stripMarkdown(text)
  text = stripLatex(text)
  text = collapseWhitespace(text)

  if (!text) return fallback
  return maxLength ? truncate(text, maxLength) : text
}

/** True when the string contains `$…$` / `$$…$$` / `\(…\)` / `\[…\]` math worth rendering. */
export function hasMath(input?: string | null): boolean {
  if (!input) return false
  return /\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/.test(input)
}

/** True when the string looks like it carries raw HTML markup. */
export function hasHtmlMarkup(input?: string | null): boolean {
  if (!input) return false
  return /<\/?[a-z][\s\S]*?>/i.test(input)
}
