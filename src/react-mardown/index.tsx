import React from "react"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import ReactMarkdown from "react-markdown"
import { Components } from "react-markdown"
import ReactPlayer from "react-player/youtube"
import "katex/dist/katex.min.css"

const isYouTubeUrl = (url?: string) => {
  if (!url) return false
  return /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/)/i.test(url)
}
const isVideoFile = (url?: string) => {
  if (!url) return false
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url)
}

/**
 * Everything except the link renderer.
 *
 * Split out so a consumer that does not want the embedded players can reuse the
 * prose styling without pulling `react-player` in behind it — see
 * `components/chat-playground/streaming-markdown.tsx`.
 */
export const baseComponents: Components = {
  // Plain link. Consumers that want media embeds override this — see
  // `components` below.
  a: ({ href, children, ...props }) => {
    if (!href) return <a {...props}>{children}</a>
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props} className="text-primary underline">
        {children}
      </a>
    )
  },
  img: ({ src, alt, node, ...props }) => (
    <img src={src} alt={alt} className="max-w-full h-auto rounded border my-2" {...props} />
  ),
  // @ts-expect-error inline is there
  code: ({ inline, children, node, ...props }) => {
    if (inline) {
      return (
        <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono w-fit" {...props}>
          {children}
        </code>
      )
    }
    return (
      <pre className="bg-muted p-3 rounded overflow-auto my-2">
        <code className="font-mono text-sm" {...props}>
          {children}
        </code>
      </pre>
    )
  },
  blockquote: ({ children, node, ...props }) => (
    <blockquote className="border-l-4 border-muted-foreground px-2 my-2 text-muted-foreground" {...props}>
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }) => (
    <div className="overflow-auto">
      <table className="w-full border-collapse border border-border" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th className="border p-2 bg-muted font-medium text-left text-primary" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border p-2 text-primary" {...props}>
      {children}
    </td>
  ),

  // --- Headers ---
  h1: ({ children, ...props }) => (
    <h1 className="text-3xl font-bold my-4 text-primary" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-2xl font-semibold my-3 text-primary" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-xl font-semibold my-2.5 text-primary" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="text-lg font-medium my-2 text-primary" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className="text-base font-medium my-1.5 text-primary" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className="text-sm font-medium my-1 text-muted-foreground uppercase tracking-wide" {...props}>
      {children}
    </h6>
  ),
  // --- Lists ---
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-6 my-2 space-y-1 text-primary" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-6 my-2 space-y-1 text-primary" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
}

/** Base styling plus media embeds: a YouTube or video link becomes a player. */
const components: Components = {
  ...baseComponents,
  a: ({ href, children, ...props }) => {
    if (!href) return <a {...props}>{children}</a>

    // YouTube
    if (isYouTubeUrl(href)) {
      // ReactPlayer (client-only) — render placeholder on server
      if (typeof window === "undefined") {
        return (
          <a href={href} target="_blank" rel="noreferrer" {...props}>
            {children}
          </a>
        )
      }
      return (
        <div className="my-2">
          <ReactPlayer url={href} controls width="100%" />
        </div>
      )
    }

    // direct video file
    if (isVideoFile(href)) {
      return (
        <div className="my-2">
          <video src={href} controls className="max-w-full h-auto rounded" />
        </div>
      )
    }

    // default link
    return (
      <a href={href} target="_blank" rel="noreferrer" {...props} className="text-primary underline">
        {children}
      </a>
    )
  },
}

const MarkdownView = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      components={components}
      className="h-fit"
    >
      {children}
    </ReactMarkdown>
  )
}

export default MarkdownView
