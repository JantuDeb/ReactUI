import { lazy, Suspense } from "react"
import type { MarkdownInputProps } from "./markdown-input"

const MarkdownInput = lazy(() => import("./markdown-input"))

export default function LazyMarkdownInput(props: MarkdownInputProps) {
  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-md bg-muted" />}>
      <MarkdownInput {...props} />
    </Suspense>
  )
}
