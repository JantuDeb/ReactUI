import { FileImage, FileUp, Trash2 } from "lucide-react"
import * as React from "react"
import { Button } from "../buttons/button"
import { cn } from "../lib/utils"
import {
  FileState,
  FileUpload,
  FileUploadClear,
  FileUploadDropzone,
  FileUploadRootProps,
  FileUploadTrigger,
  useFileUpload,
} from "./index"
import { AvatarView, BasicView, GridView, ListInsideView, ListView, TableView } from "./file-input-views"

type ViewType = "list" | "grid" | "table" | "list-inside" | "avatar" | "default"

export interface FileInputProps extends Omit<FileUploadRootProps, "children"> {
  view?: ViewType
  className?: string
  dropzoneContent?: React.ReactNode
}

// Helper components for shared UI elements
const FileInputHeader = ({ fileCount, maxFiles }: { fileCount: number; maxFiles?: number }) => {
  if (maxFiles === 1) return <></>
  return (
    <div className="flex items-center justify-between gap-2">
      <h3 className="truncate text-sm font-medium">Files ({fileCount})</h3>
      <div className="flex gap-2">
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm">
            <FileUp className="-ms-0.5 size-3.5 opacity-60" /> Add files
          </Button>
        </FileUploadTrigger>
        <FileUploadClear asChild>
          <Button variant="outline" size="sm">
            <Trash2 className="-ms-0.5 size-3.5 opacity-60" /> Remove all
          </Button>
        </FileUploadClear>
      </div>
    </div>
  )
}
const InitialDropzoneContent = ({
  content,
  maxFiles,
  maxSize,
}: {
  content?: React.ReactNode
  maxFiles?: number
  maxSize?: number
}) => {
  const maxMb = maxSize ? maxSize / 1024 / 1024 : 0
  return (
    content ?? (
      <div className="flex flex-col items-center justify-center text-center">
        <div
          className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
          aria-hidden="true"
        >
          <FileImage className="size-5 opacity-60" />
        </div>
        <p className="mb-1.5 text-sm font-medium">Drop your files here</p>
        <p className="text-muted-foreground text-xs">
          {maxFiles ? `Max ${maxFiles} files` : ""}
          {maxFiles && maxSize ? " ∙ " : ""}
          {maxSize ? `Up to ${maxMb}MB` : ""}
        </p>
        <FileUploadTrigger asChild>
          <Button variant="outline" className="mt-4">
            Select files
          </Button>
        </FileUploadTrigger>
      </div>
    )
  )
}

export const FileInput = ({
  className,
  view = "default",
  dropzoneContent,
  maxFiles,
  maxSize,
  label,
  ...props
}: FileInputProps) => {
  const finalProps = { ...props, maxFiles, maxSize, label }
  if (view === "avatar") {
    finalProps.multiple = false
    finalProps.maxFiles = 1
    finalProps.accept = props.accept ?? "image/*"
    finalProps.replaceOnSelect = true
  }

  return (
    <FileUpload {...finalProps}>
      <FileInputContent
        view={view}
        className={className}
        dropzoneContent={dropzoneContent}
        maxFiles={maxFiles}
        maxSize={maxSize}
      />
    </FileUpload>
  )
}

const ActiveView = ({ view, ...viewProps }: { view?: ViewType; maxFiles?: number; fileStates: FileState[] }) => {
  switch (view) {
    case "grid":
      return <GridView {...viewProps} />
    case "table":
      return <TableView {...viewProps} />
    case "list":
      return <ListView {...viewProps} />
    case "avatar":
      return <AvatarView {...viewProps} />
    case "default":
    default:
      return <BasicView {...viewProps} />
  }
}

// Internal component to access context
const FileInputContent = ({
  view = "default",
  className,
  dropzoneContent,
  maxFiles,
  maxSize,
  label,
}: {
  view?: ViewType
  className?: string
  dropzoneContent?: React.ReactNode
  maxFiles?: number
  maxSize?: number
  label?: string
}) => {
  const fileStates = useFileUpload((state) => Array.from(state.files.values()))
  const hasFiles = fileStates.length > 0
  const viewProps = { fileStates, maxFiles, view }

  // The 'list-inside' view has a unique layout structure
  if (view === "list-inside") {
    return (
      <FileUploadDropzone className={cn("p-0", className)}>
        {hasFiles ? (
          <ListInsideView fileStates={fileStates} />
        ) : (
          <div className="p-6">
            <InitialDropzoneContent content={dropzoneContent} maxFiles={maxFiles} maxSize={maxSize} />
          </div>
        )}
      </FileUploadDropzone>
    )
  }

  if (view === "default") {
    return (
      <div className={cn("w-full space-y-1.5", className)}>
        {label && <label className="text-sm font-medium">{label}</label>}
        {/* The dropzone wraps the BasicView to allow dropping files onto it */}
        <FileUploadDropzone className="p-0 ring-offset-0 focus-visible:ring-0">
          <BasicView fileStates={fileStates} />
        </FileUploadDropzone>
      </div>
    )
  }

  if (view === "avatar") {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        {label && <label className="text-sm font-medium">{label}</label>}
        <FileUploadDropzone className="size-24 rounded-full p-0 ring-offset-0 focus-visible:ring-0">
          <AvatarView fileStates={fileStates} />
        </FileUploadDropzone>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {!hasFiles && (
        <FileUploadDropzone>
          <InitialDropzoneContent content={dropzoneContent} maxFiles={maxFiles} maxSize={maxSize} />
        </FileUploadDropzone>
      )}

      {hasFiles && (
        <>
          <FileInputHeader fileCount={fileStates.length} maxFiles={maxFiles} />
          <ActiveView {...viewProps} />
        </>
      )}
    </div>
  )
}
