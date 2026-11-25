import { lazy, Suspense, type ComponentProps } from "react"
import type { Editor } from "tiptap-editor-library"

const TiptapEditor = lazy(() => import("./tiptap-editor"))

export default function LazyTiptapEditor(props: ComponentProps<typeof Editor>) {
  return (
    <Suspense fallback={<div className="h-32 animate-pulse rounded-md bg-muted" />}>
      <TiptapEditor {...props} />
    </Suspense>
  )
}
