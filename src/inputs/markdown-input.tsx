import React, { useState, useCallback, useMemo, useRef } from "react"
import MDEditor, {
  commands,
  ContextStore,
  executeCommand,
  ExecuteState,
  getCommands,
  ICommand,
  selectWord,
  TextAreaTextApi,
} from "@uiw/react-md-editor"
import "katex/dist/katex.min.css"
import "@uiw/react-md-editor/markdown-editor.css"
import { cn } from "../lib/utils"
import Spinner from "../loaders/spinner"
import MarkdownView from "../react-mardown"
import { FileInput, FileInputProps } from "../file-upload/file-input"
import { Modal } from "../dialogs/modal"
// import { apiClientv2 } from "src/api/api-client" // TODO: Remove API dependency
import { useTheme } from "@components/theme-provider"

// Types
interface ImageUploadResult {
  url: string
  alt?: string
}

interface MarkdownInputProps {
  value?: string
  onChange?: (value: string) => void
  label?: string
  errorText?: string
  placeholder?: string
  height?: number
  preview?: "edit" | "live" | "preview"
  disabled?: boolean
  required?: boolean
  maxLength?: number
  onImageUpload?: (file: File) => Promise<ImageUploadResult>
  className?: string
  uploadUrl?: string
  style?: React.CSSProperties
  "data-testid"?: string
  // Additional MDEditor props
  hideToolbar?: boolean
  visibleDragbar?: boolean
  toolbarBottom?: boolean
  enableScroll?: boolean
  autoFocus?: boolean
  onFocus?: () => void
  onBlur?: () => void
  id?: string
  // Image library support
  existingImages?: { id?: string | number; url: string; alt?: string }[]
  onRequestImages?: () => Promise<{ id?: string | number; url: string; alt?: string }[]>
  onUploadImageToLibrary?: (file: File) => Promise<{ id?: string | number; url: string; alt?: string }>
  showImageLibraryButton?: boolean
}

const MarkdownInput: React.FC<MarkdownInputProps> = ({
  value,
  onChange,
  placeholder = "Enter markdown text here... (Paste or drop images to upload)",
  height = 200,
  preview = "edit",
  disabled = false,
  required = false,
  maxLength,
  onImageUpload,
  className,

  hideToolbar = false,
  visibleDragbar = true,
  toolbarBottom = false,
  enableScroll = true,
  autoFocus = false,
  onFocus,
  onBlur,
  "data-testid": dataTestId,
  id,
  uploadUrl,
  existingImages = [],
  onRequestImages,
  onUploadImageToLibrary,
  showImageLibraryButton = true,
}) => {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [open, setOpen] = useState(false)
  const editorRef = useRef<ContextStore>(null)

  // Internal state for uncontrolled mode
  const [internalValue, setInternalValue] = useState(value || "")

  // Determine if component is controlled or uncontrolled
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  // Sync internal value when prop changes (for controlled mode)
  React.useEffect(() => {
    if (isControlled && value !== internalValue) {
      setInternalValue(value)
    }
  }, [value, isControlled, internalValue])

  const handleValueChange = useCallback(
    (newValue?: string) => {
      console.log("newValue", newValue)
      const sanitizedValue = newValue || ""

      // Check max length
      if (maxLength && sanitizedValue.length > maxLength) {
        return
      }

      // Update internal state for uncontrolled mode
      if (!isControlled) {
        setInternalValue(sanitizedValue)
      }

      // Always call onChange if provided
      onChange?.(sanitizedValue)
    },
    [onChange, maxLength, isControlled],
  )

  // Efficient insertion at current selection using native API (no full string reconstruction beyond selection)
  // Falls back gracefully if ref/textarea missing.
  const insertTextAtCursor = useCallback(
    (text: string) => {
      const store = editorRef.current
      const textarea = store?.textarea
      if (!textarea) return

      const start = textarea.selectionStart ?? 0
      const end = textarea.selectionEnd ?? start

      // If maxLength is enforced, pre‑validate
      if (maxLength && textarea.value.length - (end - start) + text.length > maxLength) return

      // Use native replace so only necessary part mutates
      textarea.setRangeText(text, start, end, "end")

      const newValue = textarea.value

      // Propagate to internal / external state
      if (!isControlled) setInternalValue(newValue)
      if (store?.dispatch) store.dispatch({ markdown: newValue })
      onChange?.(newValue)

      // Ensure focus & selection after async paint
      requestAnimationFrame(() => {
        const pos = start + text.length
        textarea.focus()
        textarea.setSelectionRange(pos, pos)
      })
    },
    [isControlled, maxLength, onChange],
  )
  // NOTE: If you ever need the richer selection logic (prefix/suffix wrapping) like built-in commands use,
  // you can adapt this by constructing a faux ICommand and using executeCommand from @uiw/react-md-editor:
  // executeCommand({ api: { replaceSelection: (str)=>textarea.setRangeText(str,...), setSelectionRange: ... }, prefix: '![', suffix: '](url)', ... })
  // For simple direct inserts this lightweight native approach avoids extra allocations.

  // Memoize the upload function to prevent unnecessary re-renders
  const uploadImage = useCallback(
    async (file: File): Promise<ImageUploadResult | null> => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        console.error("Invalid file type. Only images are allowed.")
        return null
      }

      // Validate file size (e.g., 5MB limit)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        console.error("File too large. Maximum size is 5MB.")
        return null
      }

      try {
        setUploading(true)
        let result: ImageUploadResult | null = null

        if (uploadUrl) {
          // Use apiClientv2 for upload
          const formData = new FormData()
          formData.append("file", file)
          const response = await apiClientv2.post(uploadUrl, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          result = response.data as ImageUploadResult
        } else if (onImageUpload) {
          // Fallback to onImageUpload prop
          result = await onImageUpload(file)
        } else {
          console.warn("Image upload handler not provided")
          return null
        }

        return result
      } catch (error) {
        console.error("Image upload failed:", error)
        return null
      } finally {
        setUploading(false)
      }
    },
    [onImageUpload, uploadUrl],
  )

  // Handle paste events
  const handlePaste = useCallback(
    async (event: React.ClipboardEvent) => {
      const items = event.clipboardData?.items
      if (!items) return

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.type.indexOf("image") !== -1) {
          event.preventDefault()
          const file = item.getAsFile()
          if (file) {
            const result = await uploadImage(file)
            if (result) {
              const markdownImage = `![${result.alt || file.name}](${result.url})`
              insertTextAtCursor(markdownImage)
            }
          }
          break
        }
      }
    },
    [uploadImage, insertTextAtCursor],
  )

  // Handle drop events
  const handleDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault()
      setDragActive(false)

      const files = event.dataTransfer?.files
      if (!files) return

      const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))

      if (imageFiles.length === 0) return
      // Handle multiple images
      const uploadPromises = imageFiles.map((file) => uploadImage(file))
      const results = await Promise.all(uploadPromises)

      const validResults = results.filter((result): result is ImageUploadResult => result !== null)

      if (validResults.length > 0) {
        const markdownImages = validResults.map((result) => `![${result.alt || "Image"}](${result.url})`).join("\n\n")

        insertTextAtCursor(markdownImages)
      }
    },
    [uploadImage, insertTextAtCursor],
  )

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
  }, [])

  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setDragActive(false)
    }
  }, [])

  const imageCommand: ICommand = {
    name: "image",
    keyCommand: "image",
    shortcuts: "ctrlcmd+k",
    // We override default behavior to show modal instead of immediate markdown insertion.
    prefix: "",
    suffix: "",
    buttonProps: { "aria-label": "Insert image (ctrl + k)", title: "Insert image (ctrl + k)" },
    icon: (
      <svg width="13" height="13" viewBox="0 0 20 20">
        <path
          fill="currentColor"
          d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
        />
      </svg>
    ),
    execute: () => {
      setOpen(true)
    },
  }

  // Memoize the preview component to prevent unnecessary re-renders
  const previewComponent = useMemo(
    () => ({
      preview: (source: string) => <MarkdownView>{source}</MarkdownView>,
    }),
    [],
  )

  const characterCount = currentValue.length
  const isOverLimit = maxLength ? characterCount > maxLength : false
  const isRequired = required && !currentValue.trim()

  const handleFileUpload = useCallback(
    async (
      files: Array<File>,
      options: {
        onProgress: (file: File, progress: number) => void
        onSuccess: (file: File) => void
        onError: (file: File, error: Error) => void
      },
    ) => {
      for (const file of files) {
        try {
          options.onProgress(file, 30)
          const result = await uploadImage(file)
          options.onProgress(file, 100)
          options.onSuccess(file)
          if (result) {
            insertTextAtCursor(`![${result.alt || file.name}](${result.url})`)
          }
        } catch (e: any) {
          options.onError(file, e instanceof Error ? e : new Error("Upload failed"))
        }
      }
      // Close modal after processing
      setOpen(false)
      // Return focus to editor
      setTimeout(() => editorRef.current?.textarea?.focus(), 0)
    },
    [insertTextAtCursor, uploadImage],
  )
  return (
    <div
      className={cn("w-full", className)}
      data-testid={dataTestId}
      data-color-mode={
        typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light"
      }
    >
      {uploading && (
        <p className="flex items-center">
          <Spinner />
          Uploading image...
        </p>
      )}

      <MDEditor
        commands={[...getCommands().filter((c) => c.name !== "image"), imageCommand]}
        style={
          {
            "--color-canvas-default": "var(--sidebar)",
            height: "100%",
          } as any
        }
        className={cn(
          "transition-all",
          dragActive && "border-2 border-dashed border-primary rounded-md bg-secondary border-collapse",
        )}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        id={id}
        ref={editorRef}
        value={currentValue}
        onChange={handleValueChange}
        height={height}
        preview={preview}
        visibleDragbar={visibleDragbar}
        hideToolbar={hideToolbar}
        toolbarBottom={toolbarBottom}
        enableScroll={enableScroll}
        autoFocus={autoFocus}
        components={previewComponent}
        previewOptions={{
          className: "w-1/2 !p-2 h-fit",
        }}
        // extraCommands={
        //   showImageLibraryButton
        //     ? [
        //         {
        //           name: "image-library",
        //           keyCommand: "image-library",
        //           buttonProps: { "aria-label": "Insert image" },
        //           icon: (
        //             <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-muted" title="Insert Image">
        //               IMG
        //             </span>
        //           ),
        //           execute: () => openImageLibrary(),
        //         },
        //       ]
        //     : []
        // }
        textareaProps={{
          placeholder,
          disabled,
          maxLength,
          onFocus,
          onBlur,
          className: "w-1/2 h-fit text-primary",
          style: {
            fontSize: "14px",
            lineHeight: "1.6",
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            resize: "none",
          },
        }}
      />

      <Modal open={open} onOpenChange={setOpen} header="Insert Image">
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Upload an image. After successful upload it will be inserted at the cursor position.
          </p>
          <FileInput accept="image/*" label="Image" maxFiles={1} onUpload={handleFileUpload} />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm px-3 py-1.5 rounded-md border bg-muted hover:bg-muted/80"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export { MarkdownInput }

// Export types for use in other components
export type { MarkdownInputProps, ImageUploadResult }
