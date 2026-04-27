import { Button } from "../buttons/button"
import {
  FileState,
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
  useFileUpload,
} from "./index"
import { Upload, X } from "lucide-react"
import * as React from "react"
// import { toast } from "sonner"

export function FileUploadValidationDemo() {
  const onFileValidate = React.useCallback((file: File) => {
    console.log("file", file)
    return undefined
  }, [])

  const onFileReject = React.useCallback((file: File, message: string) => {
    console.log("message", message)
    // toast(message, {
    //   description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    // })
  }, [])

  return (
    <FileUpload
      //   value={files}
      //   onValueChange={setFiles}
      onFileValidate={onFileValidate}
      onFileReject={onFileReject}
      accept="image/*"
      maxFiles={2}
      multiple
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">Or click to browse (max 2 files)</p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse files
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>{(files) => <List fileStateList={files} />}</FileUploadList>
    </FileUpload>
  )
}

function List({ fileStateList }: { fileStateList: Array<FileState> }) {
  return (
    <>
      {fileStateList.map((fileState) => (
        <FileUploadItem key={fileState.file.name} value={fileState}>
          <FileUploadItemPreview />
          <FileUploadItemMetadata />
          <FileUploadItemDelete asChild>
            <Button variant="ghost" size="icon" className="size-7">
              <X />
            </Button>
          </FileUploadItemDelete>
        </FileUploadItem>
      ))}
    </>
  )
}

import { FileInput } from "./file-input"

export function FileuploadExample() {
  const [value, setValue] = React.useState<any>()
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 p-4">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Basic File upload (Default)</h3>
        <FileInput
          view="default"
          label="Upload file"
          replaceOnSelect
          onValueChange={(files) => setValue(files)}
          onFileReject={(file, message) => console.log(message)}
          value={value}
          accept="image/*,application/pdf"
          maxFiles={1}
          // multiple // Allow multiple files to demonstrate comma separation
          // Can be used with react-hook-form's Controller as well
        />
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Avatar Image Upload</h3>
        <FileInput
          view="avatar"
          label="Profile Picture"
          replaceOnSelect
          onValueChange={(files) => console.log(files)}
          onFileReject={(file, message) => console.log(message)}
          // No need to specify multiple={false} or maxFiles={1},
          // the component handles it for you!
          // You can still specify a more restrictive `accept` prop if needed:
          // accept="image/png, image/jpeg"
        />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">List View (Default)</h3>
        <FileInput
          view="list"
          maxFiles={5}
          maxSize={4 * 1024 * 1024} // 4MB
        />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Grid View</h3>
        <FileInput view="grid" accept="image/*" />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Table View</h3>
        <FileInput view="table" maxFiles={10} />
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">List Inside View</h3>
        <FileInput view="list-inside" maxFiles={3} />
      </div>
    </div>
  )
}
