import React, { useCallback, useRef, ReactNode } from "react"

type FileUploadWrapperProps = {
  children: ReactNode
  acceptedFormats?: string
  className?: string
} & (
  | { onFileSelect: (file: File) => void; multiple?: false | undefined }
  | { onFileSelect: (files: File[]) => void; multiple: true }
)

export default function FileUploadWrapper({
  children,
  onFileSelect,
  acceptedFormats = ".xls,.csv",
  multiple = false,
  className,
}: FileUploadWrapperProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      const droppedFiles = Array.from(e.dataTransfer.files)
      if (droppedFiles.length > 0) {
        //@ts-expect-error ts does not understand that multiple is a boolean
        onFileSelect(multiple ? droppedFiles : droppedFiles[0])
      }
    },
    [onFileSelect, multiple],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files ? Array.from(e.target.files) : []
      if (selectedFiles.length > 0) {
        //@ts-expect-error ts does not understand that multiple is a boolean
        onFileSelect(multiple ? selectedFiles : selectedFiles[0])
      }
    },
    [onFileSelect, multiple],
  )

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={className}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInput}
        accept={acceptedFormats}
        multiple={multiple}
        hidden
      />
    </div>
  )
}
