import { Download, Trash2, Upload, User, X } from "lucide-react"
import { Button } from "../buttons/button"
import {
  FileState,
  FileUploadClear,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadProps,
  FileUploadTrigger,
  formatBytes,
  isFile,
  UploadFile,
} from "./index" // Path to your core file-upload components
import { cn } from "../lib/utils"

interface ViewProps extends Pick<FileUploadProps, "maxFiles"> {
  fileStates: FileState[]
}

export function BasicView({ fileStates }: ViewProps) {
  const fileCount = fileStates.length
  const fileNames = fileStates.map((fs) => fs.file.name).join(", ")
  const displayText = fileNames || "No file chosen"

  return (
    // The FileUploadTrigger makes the entire element clickable
    <FileUploadTrigger asChild>
      <div
        className="flex h-10 w-full cursor-pointer items-center overflow-hidden rounded-md border border-input bg-background text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 group"
        role="button"
        aria-label="Choose file"
      >
        <span className="flex h-full items-center whitespace-nowrap bg-muted px-3 font-medium">
          {fileCount > 0 ? `Files(${fileCount})` : "Choose File"}
        </span>
        <span className="truncate px-3 text-muted-foreground">{displayText}</span>
        {fileCount > 0 && (
          <FileUploadClear asChild>
            <div className="flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 ml-auto mr-0.5">
              <Button size="sm" variant="ghost" tooltip="Remove all">
                <X className="size-4" />
              </Button>
            </div>
          </FileUploadClear>
        )}
      </div>
    </FileUploadTrigger>
  )
}

// --- List View ---
export function ListView({ fileStates }: ViewProps) {
  return (
    <div className="w-full space-y-2">
      {fileStates.map((fileState) => (
        <FileUploadItem key={fileState.id} value={fileState}>
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center gap-2.5">
              <FileUploadItemPreview className="size-10" />
              <FileUploadItemMetadata className="min-w-0" />
              <FileUploadItemDelete asChild>
                <Button variant="ghost" size="icon" className="size-7 shrink-0">
                  <X className="size-4" />
                </Button>
              </FileUploadItemDelete>
            </div>
            <FileUploadItemProgress />
          </div>
        </FileUploadItem>
      ))}
    </div>
  )
}

// --- Grid View ---
export function GridView({ fileStates }: ViewProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        fileStates.length === 1 ? "grid-cols-1 max-w-[12rem] mx-auto" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
      )}
    >
      {fileStates.map((fileState) => (
        <FileUploadItem key={fileState.id} value={fileState} className="relative aspect-square h-full w-full p-0">
          <>
            <FileUploadItemPreview className="h-full w-full rounded-md" />
            <FileUploadItemMetadata className="absolute inset-x-0 bottom-0 z-10 flex flex-col bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
              <span className="truncate font-medium text-sm">{fileState.file.name}</span>
              {fileState.file.size && (
                <span className="truncate text-xs">
                  {new Intl.NumberFormat("en", {
                    style: "unit",
                    unit: "byte",
                    notation: "compact",
                    unitDisplay: "narrow",
                  }).format(fileState.file.size)}
                </span>
              )}
            </FileUploadItemMetadata>
            <FileUploadItemDelete asChild>
              <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 z-20 size-6 rounded-full">
                <X className="size-3.5" />
              </Button>
            </FileUploadItemDelete>
          </>
        </FileUploadItem>
      ))}
    </div>
  )
}

// --- Table View ---
export function TableView({ fileStates }: ViewProps) {
  const getFileType = (file: UploadFile) => file.type?.split("/")[1]?.toUpperCase() || "UNKNOWN"
  // const formatBytes = (bytes: number) =>
  //   new Intl.NumberFormat("en", {
  //     style: "unit",
  //     unit: "byte",
  //     notation: "compact",
  //     unitDisplay: "narrow",
  //   }).format(bytes)

  return (
    <div className="overflow-x-auto rounded-md border w-full">
      <table className="table text-sm">
        <thead className="bg-muted/50 text-xs">
          <tr className="border-b">
            <th className="h-9 px-4 py-2 text-left font-medium">Name</th>
            <th className="h-9 px-4 py-2 text-left font-medium">Type</th>
            <th className="h-9 px-4 py-2 text-left font-medium">Size</th>
            <th className="h-9 w-0 px-4 py-2 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fileStates.map((fileState) => (
            <FileUploadItem key={fileState.file.name} value={fileState} asChild>
              <tr className="border-b transition-colors hover:bg-muted/50">
                <td className="p-1 font-medium">
                  <span className="flex items-center gap-2">
                    <FileUploadItemPreview className="size-8" />
                    <span className="truncate">{fileState.file?.name || fileState.id}</span>
                  </span>
                </td>
                <td className="p-1 text-muted-foreground">{getFileType(fileState.file)}</td>
                <td className="p-1 text-muted-foreground text-nowrap">{formatBytes(fileState.file.size)}</td>
                <td className="whitespace-nowrap p-1 text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    onClick={() => isFile(fileState.file) && window.open(URL.createObjectURL(fileState.file), "_blank")}
                  >
                    <Download className="size-4" />
                  </Button>
                  <FileUploadItemDelete asChild>
                    <Button size="icon" variant="ghost" className="size-8">
                      <Trash2 className="size-4" />
                    </Button>
                  </FileUploadItemDelete>
                </td>
              </tr>
            </FileUploadItem>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// --- List Inside View ---
export function ListInsideView({ fileStates }: ViewProps) {
  return (
    <div className="w-full space-y-2 p-3">
      {fileStates.map((fileState) => (
        <FileUploadItem key={fileState.id} value={fileState} className="bg-background rounded-lg border p-2">
          <>
            <FileUploadItemPreview className="size-10" />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-7 shrink-0">
                <X className="size-4" />
              </Button>
            </FileUploadItemDelete>
          </>
        </FileUploadItem>
      ))}
      <FileUploadTrigger asChild>
        <Button variant="outline" className="mt-2 w-full">
          <Upload className="-ms-1 size-4 opacity-60" />
          Add more
        </Button>
      </FileUploadTrigger>
    </div>
  )
}

// --- Avatar View ---
export function AvatarView({ fileStates }: ViewProps) {
  const fileState = fileStates[0]

  return (
    // <FileUploadTrigger asChild>
    <div
      className="group relative flex size-24 cursor-pointer items-center justify-center rounded-full"
      role="button"
      aria-label="Upload avatar"
    >
      {fileState ? (
        <FileUploadItem value={fileState} className="h-full w-full rounded-full border-2 border-dashed p-0">
          {/* The preview for the selected image */}
          <FileUploadItemPreview className="h-full w-full rounded-full object-cover" />

          {/* A delete button that appears on hover */}
          <FileUploadItemDelete asChild>
            <div className="absolute right-0 top-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Button variant="destructive" size="icon" className="size-6 rounded-full">
                <X className="size-4" />
              </Button>
            </div>
          </FileUploadItemDelete>
        </FileUploadItem>
      ) : (
        // Placeholder when no file is selected
        <div className="flex size-full items-center justify-center rounded-full border-2 border-dashed border-input">
          <User className="size-10 text-muted-foreground" />
        </div>
      )}
    </div>
    // </FileUploadTrigger>
  )
}
