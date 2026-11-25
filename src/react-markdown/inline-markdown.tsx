import React, { useMemo } from "react"
import ReactMarkdown from "react-markdown"
import type { Components } from "react-markdown"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import { cn } from "../lib/utils"
import { hasHtmlMarkup, hasMath, toPlainPreview, truncate } from "../utils/text-preview"
import "katex/dist/katex.min.css"

/**
 * Renders short strings (question/answer titles, option text) as a single line with KaTeX math,
 * using the same remark-math + rehype-katex pipeline as MarkdownView.
 *
 * Block-level markdown is flattened to inline elements so it can live inside a list row or heading.
 * Raw HTML is NEVER injected — react-markdown escapes it, and image markup degrades to alt text.
 */
const inlineComponents: Components = {
  p: ({ children }) => <>{children}</>,
  h1: ({ children }) => <>{children}</>,
  h2: ({ children }) => <>{children}</>,
  h3: ({ children }) => <>{children}</>,
  h4: ({ children }) => <>{children}</>,
  h5: ({ children }) => <>{children}</>,
  h6: ({ children }) => <>{children}</>,
  ul: ({ children }) => <>{children}</>,
  ol: ({ children }) => <>{children}</>,
  li: ({ children }) => <>{children} </>,
  blockquote: ({ children }) => <>{children}</>,
  pre: ({ children }) => <>{children}</>,
  br: () => <> </>,
  hr: () => null,
  code: ({ children, ...props }) => (
    <code className="bg-muted rounded px-1 font-mono text-[0.9em]" {...props}>
      {children}
    </code>
  ),
  a: ({ children }) => <span className="underline">{children}</span>,
  img: ({ alt }) => <span className="text-muted-foreground italic">{alt?.trim() || "[image]"}</span>,
}

export interface InlineMarkdownProps {
  children?: string | null
  /** Rendered when the source string is empty after normalisation. */
  fallback?: string
  /** Truncate the source string (word-boundary aware) before rendering. */
  maxLength?: number
  className?: string
  /** Native tooltip text. Pass a plain-text preview — never raw markup. */
  title?: string
  /** Element wrapping the rendered output. Defaults to `span`. */
  as?: "span" | "div" | "p"
}

const InlineMarkdown: React.FC<InlineMarkdownProps> = ({
  children,
  fallback = "Untitled",
  maxLength,
  className,
  title,
  as: Tag = "span",
}) => {
  const source = useMemo(() => {
    const raw = (children ?? "").trim()
    if (!raw) return ""

    const plain = toPlainPreview(raw)
    // Nothing readable survives normalisation (e.g. a bare <img> tag) → fall back to the placeholder.
    if (!plain) return ""

    // Raw HTML markup is never worth rendering as markdown: react-markdown escapes it, so the user
    // would see the literal tag source (e.g. `<img src="…">`) as the title. Render the stripped
    // plain-text preview instead. Math is still rendered below when the source contains it.
    if (hasHtmlMarkup(raw) && !hasMath(raw)) {
      return maxLength ? truncate(plain, maxLength) : plain
    }

    return maxLength ? truncate(raw, maxLength) : raw
  }, [children, maxLength])

  if (!source) {
    return (
      <Tag className={cn("text-muted-foreground", className)} title={title}>
        {fallback}
      </Tag>
    )
  }

  return (
    <Tag
      className={cn(
        // KaTeX renders display math as a block; keep it inline so it flows with the text and
        // stays clampable. `break-words` stops long unbroken formulae from overflowing the row.
        "[&_.katex-display]:my-0 [&_.katex-display]:inline-block [&_.katex]:inline-block",
        "break-words [&_.katex]:whitespace-normal",
        className,
      )}
      title={title}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={inlineComponents}
      >
        {source}
      </ReactMarkdown>
    </Tag>
  )
}

export default InlineMarkdown
