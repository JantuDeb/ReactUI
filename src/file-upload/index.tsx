import { cn, isFunction } from "../lib/utils"
import { Slot } from "@radix-ui/react-slot"
import {
  FileArchiveIcon,
  FileAudioIcon,
  FileCodeIcon,
  FileCogIcon,
  FileIcon,
  FileTextIcon,
  FileVideoIcon,
} from "lucide-react"
import * as React from "react"

const ROOT_NAME = "FileUpload"
const DROPZONE_NAME = "FileUploadDropzone"
const TRIGGER_NAME = "FileUploadTrigger"
const LIST_NAME = "FileUploadList"
const ITEM_NAME = "FileUploadItem"
const ITEM_PREVIEW_NAME = "FileUploadItemPreview"
const ITEM_METADATA_NAME = "FileUploadItemMetadata"
const ITEM_PROGRESS_NAME = "FileUploadItemProgress"
const ITEM_DELETE_NAME = "FileUploadItemDelete"
const CLEAR_NAME = "FileUploadClear"

function useLazyRef<T>(fn: () => T) {
  const ref = React.useRef<T | null>(null)

  if (ref.current === null) {
    ref.current = fn()
  }

  return ref as React.RefObject<T>
}

type Direction = "ltr" | "rtl"

const DirectionContext = React.createContext<Direction | undefined>(undefined)

function useDirection(dirProp?: Direction): Direction {
  const contextDir = React.useContext(DirectionContext)
  return dirProp ?? contextDir ?? "ltr"
}

type FileItem = {
  id?: string
  url: string
  name: string
  size?: number
  type?: string
}

type FileObjectType = File | FileItem

export function isFileItem(file: FileObjectType): file is FileItem {
  return "url" in file && typeof (file as FileItem).url === "string"
}

export function isFile(file: FileObjectType): file is File {
  return file instanceof File
}

export interface FileState {
  id: string
  file: FileObjectType
  progress: number
  error?: string
  status: "idle" | "uploading" | "error" | "success"
}

interface StoreState {
  files: Map<string, FileState>
  dragOver: boolean
  invalid: boolean
}

type StoreAction =
  | { type: "ADD_FILES"; files: FileObjectType[] }
  | { type: "SET_FILES"; files: FileObjectType[] }
  | { type: "SET_PROGRESS"; id: string; progress: number }
  | { type: "SET_SUCCESS"; id: string }
  | { type: "SET_ERROR"; id: string; error: string }
  | { type: "REMOVE_FILE"; id: string }
  | { type: "SET_DRAG_OVER"; dragOver: boolean }
  | { type: "SET_INVALID"; invalid: boolean }
  | { type: "CLEAR" }

function createStore(
  listeners: Set<() => void>,
  files: Map<string, FileState>,
  urlCache: WeakMap<File, string>,
  invalid: boolean,
  onValueChange?: (files: FileObjectType[]) => void,
) {
  let state: StoreState = {
    files,
    dragOver: false,
    invalid: invalid,
  }

  function reducer(state: StoreState, action: StoreAction): StoreState {
    switch (action.type) {
      case "ADD_FILES": {
        for (const file of action.files) {
          const id = isFileItem(file) ? (file.id ?? crypto.randomUUID()) : crypto.randomUUID()
          files.set(id, {
            id,
            file,
            progress: isFileItem(file) ? 100 : 0,
            status: isFileItem(file) ? "success" : "idle",
          })
        }

        if (onValueChange) {
          const fileList = Array.from(files.values()).map((fileState) => fileState.file)
          onValueChange(fileList)
        }
        return { ...state, files }
      }

      case "SET_FILES": {
        const newFileMap = new Map(
          action.files.map((file) => {
            const id = isFileItem(file) ? (file.id ?? crypto.randomUUID()) : crypto.randomUUID()
            console.log("id", id)
            return [
              id,
              {
                id,
                file,
                progress: isFileItem(file) ? 100 : 0,
                status: (isFileItem(file) ? "success" : "idle") as FileState["status"],
              },
            ]
          }),
        )

        files.clear()
        for (const [id, fileState] of newFileMap) {
          console.log("fileState", fileState)
          files.set(id, fileState)
        }

        if (onValueChange) {
          const fileList = Array.from(files.values()).map((fileState) => fileState.file)
          console.log("fileList", fileList)
          onValueChange(fileList)
        }
        return { ...state, files }
      }

      case "SET_PROGRESS": {
        const fileState = files.get(action.id)
        if (fileState) {
          files.set(action.id, {
            ...fileState,
            progress: action.progress,
            status: "uploading",
          })
        }
        return { ...state, files }
      }

      case "SET_SUCCESS": {
        const fileState = files.get(action.id)
        if (fileState) {
          files.set(action.id, {
            ...fileState,
            progress: 100,
            status: "success",
          })
        }
        return { ...state, files }
      }

      case "SET_ERROR": {
        const fileState = files.get(action.id)
        if (fileState) {
          files.set(action.id, {
            ...fileState,
            error: action.error,
            status: "error",
          })
        }
        return { ...state, files }
      }

      case "REMOVE_FILE": {
        const fileState = files.get(action.id)
        if (fileState && !isFileItem(fileState.file)) {
          const cachedUrl = urlCache.get(fileState.file as File)
          if (cachedUrl) {
            URL.revokeObjectURL(cachedUrl)
            urlCache.delete(fileState.file as File)
          }
        }

        files.delete(action.id)

        if (onValueChange) {
          const fileList = Array.from(files.values()).map((fileState) => fileState.file)
          onValueChange(fileList)
        }
        return { ...state, files }
      }

      case "SET_DRAG_OVER": {
        return { ...state, dragOver: action.dragOver }
      }

      case "SET_INVALID": {
        return { ...state, invalid: action.invalid }
      }

      case "CLEAR": {
        for (const fileState of files.values()) {
          if (!isFileItem(fileState.file)) {
            const cachedUrl = urlCache.get(fileState.file as File)
            if (cachedUrl) {
              URL.revokeObjectURL(cachedUrl)
              urlCache.delete(fileState.file as File)
            }
          }
        }

        files.clear()
        if (onValueChange) {
          onValueChange([])
        }
        return { ...state, files, invalid: false }
      }

      default:
        return state
    }
  }

  function getState() {
    return state
  }

  function dispatch(action: StoreAction) {
    state = reducer(state, action)
    for (const listener of listeners) {
      listener()
    }
  }

  function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  return { getState, dispatch, subscribe }
}

const StoreContext = React.createContext<ReturnType<typeof createStore> | null>(null)

function useStoreContext(consumerName: string) {
  const context = React.useContext(StoreContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``)
  }
  return context
}

function useStore<T>(selector: (state: StoreState) => T): T {
  const store = useStoreContext(ROOT_NAME)

  const lastValueRef = useLazyRef<{ value: T; state: StoreState } | null>(() => null)

  const getSnapshot = React.useCallback(() => {
    const state = store.getState()
    const prevValue = lastValueRef.current

    if (prevValue && prevValue.state === state) {
      return prevValue.value
    }

    const nextValue = selector(state)
    lastValueRef.current = { value: nextValue, state }
    return nextValue
  }, [store, selector, lastValueRef])

  return React.useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot)
}

interface FileUploadContextValue {
  inputId: string
  dropzoneId: string
  listId: string
  labelId: string
  disabled: boolean
  dir: Direction
  inputRef: React.RefObject<HTMLInputElement | null>
  urlCache: WeakMap<File, string>
}

const FileUploadContext = React.createContext<FileUploadContextValue | null>(null)

function useFileUploadContext(consumerName: string) {
  const context = React.useContext(FileUploadContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``)
  }
  return context
}

export interface FileUploadRootProps extends Omit<React.ComponentPropsWithoutRef<"div">, "defaultValue" | "onChange"> {
  value?: FileObjectType[]
  defaultValue?: FileObjectType[]
  onValueChange?: (files: FileObjectType[]) => void
  onAccept?: (files: FileObjectType[]) => void
  onFileAccept?: (file: FileObjectType) => void
  onFileReject?: (file: File, message: string) => void
  onFileValidate?: (file: File) => string | null | undefined
  onRemoveExisting?: (file: FileItem) => Promise<void> | void
  onUpload?: (
    files: File[],
    options: {
      onProgress: (file: File, progress: number) => void
      onSuccess: (file: File) => void
      onError: (file: File, error: Error) => void
    },
  ) => Promise<void> | void
  accept?: string
  maxFiles?: number
  minFiles?: number
  maxSize?: number
  dir?: Direction
  label?: string
  name?: string
  asChild?: boolean
  disabled?: boolean
  invalid?: boolean
  multiple?: boolean
  required?: boolean
  replaceOnSelect?: boolean
  ref?: React.Ref<HTMLDivElement>
}

function FileUploadRoot(props: FileUploadRootProps) {
  const {
    value,
    defaultValue,
    onValueChange,
    onAccept,
    onFileAccept,
    onFileReject,
    onFileValidate,
    onRemoveExisting,
    onUpload,
    accept,
    maxFiles,
    maxSize,
    dir: dirProp,
    label,
    name,
    asChild,
    disabled = false,
    invalid = false,
    multiple = false,
    required = false,
    children,
    className,
    replaceOnSelect = false,
    ...rootProps
  } = props

  const inputId = React.useId()
  const dropzoneId = React.useId()
  const listId = React.useId()
  const labelId = React.useId()

  const dir = useDirection(dirProp)
  const listeners = useLazyRef(() => new Set<() => void>()).current
  const files = useLazyRef<Map<string, FileState>>(() => new Map()).current
  const urlCache = useLazyRef(() => new WeakMap<File, string>()).current
  const inputRef = React.useRef<HTMLInputElement>(null)
  const isControlled = value !== undefined

  const store = React.useMemo(
    () => createStore(listeners, files, urlCache, invalid, onValueChange),
    [listeners, files, invalid, onValueChange, urlCache],
  )

  const acceptTypes = React.useMemo(() => accept?.split(",").map((t) => t.trim()) ?? null, [accept])

  const onProgress = useLazyRef(() => {
    let frame = 0
    return (file: File, progress: number) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const id = Array.from(store.getState().files.entries()).find(([_, state]) => state.file === file)?.[0]
        if (id) {
          store.dispatch({
            type: "SET_PROGRESS",
            id,
            progress: Math.min(Math.max(0, progress), 100),
          })
        }
      })
    }
  }).current

  React.useEffect(() => {
    if (isControlled) {
      const currentFiles = value ?? []
      const storeFiles = Array.from(store.getState().files.values()).map((state) => state.file)

      // Check if files have actually changed to prevent infinite loops
      const hasChanged =
        currentFiles.length !== storeFiles.length ||
        currentFiles.some((file, index) => {
          const storeFile = storeFiles[index]
          if (isFile(file) && isFile(storeFile)) {
            return file !== storeFile
          }
          if (isFileItem(file) && isFileItem(storeFile)) {
            return file.url !== storeFile.url || file.id !== storeFile.id
          }
          return true
        })

      if (hasChanged) {
        console.log("currentFiles", currentFiles)
        store.dispatch({ type: "SET_FILES", files: currentFiles })
      }
    } else if (defaultValue && defaultValue.length > 0 && !store.getState().files.size) {
      store.dispatch({ type: "SET_FILES", files: defaultValue })
    }
  }, [value, defaultValue, isControlled, store])

  React.useEffect(() => {
    return () => {
      for (const fileState of files.values()) {
        if (!isFileItem(fileState.file)) {
          const cachedUrl = urlCache.get(fileState.file as File)
          if (cachedUrl) {
            URL.revokeObjectURL(cachedUrl)
          }
        }
      }
    }
  }, [files, urlCache])

  const onFilesChange = React.useCallback(
    (originalFiles: File[]) => {
      if (disabled) return

      let filesToProcess = [...originalFiles]
      let invalid = false

      if (maxFiles && !replaceOnSelect) {
        const currentCount = store.getState().files.size
        const remainingSlotCount = Math.max(0, maxFiles - currentCount)

        if (remainingSlotCount < filesToProcess.length) {
          const rejectedFiles = filesToProcess.slice(remainingSlotCount)
          invalid = true

          filesToProcess = filesToProcess.slice(0, remainingSlotCount)

          for (const file of rejectedFiles) {
            let rejectionMessage = `Maximum ${maxFiles} files allowed`

            if (onFileValidate) {
              const validationMessage = onFileValidate(file)
              if (validationMessage) {
                rejectionMessage = validationMessage
              }
            }

            onFileReject?.(file, rejectionMessage)
          }
        }
      }

      const acceptedFiles: File[] = []
      const rejectedFiles: { file: File; message: string }[] = []

      for (const file of filesToProcess) {
        let rejected = false
        let rejectionMessage = ""

        if (onFileValidate) {
          const validationMessage = onFileValidate(file)
          if (validationMessage) {
            rejectionMessage = validationMessage
            onFileReject?.(file, rejectionMessage)
            rejected = true
            invalid = true
            continue
          }
        }

        if (acceptTypes) {
          const fileType = file.type
          const fileExtension = `.${file.name.split(".").pop()}`

          if (
            !acceptTypes.some(
              (type) =>
                type === fileType ||
                type === fileExtension ||
                (type.includes("/*") && fileType.startsWith(type.replace("/*", "/"))),
            )
          ) {
            rejectionMessage = "File type not accepted"
            onFileReject?.(file, rejectionMessage)
            rejected = true
            invalid = true
          }
        }

        if (maxSize && file.size > maxSize) {
          rejectionMessage = "File too large"
          onFileReject?.(file, rejectionMessage)
          rejected = true
          invalid = true
        }

        if (!rejected) {
          acceptedFiles.push(file)
        } else {
          rejectedFiles.push({ file, message: rejectionMessage })
        }
      }

      if (invalid) {
        store.dispatch({ type: "SET_INVALID", invalid })
        setTimeout(() => {
          store.dispatch({ type: "SET_INVALID", invalid: false })
        }, 2000)
      }

      if (acceptedFiles.length > 0) {
        store.dispatch({ type: replaceOnSelect ? "SET_FILES" : "ADD_FILES", files: acceptedFiles })

        if (isControlled && onValueChange) {
          const currentFiles = Array.from(store.getState().files.values()).map((f) => f.file)
          onValueChange([...currentFiles])
        }

        if (onAccept) {
          onAccept(acceptedFiles)
        }

        for (const file of acceptedFiles) {
          onFileAccept?.(file)
        }

        if (onUpload) {
          requestAnimationFrame(() => {
            onFilesUpload(acceptedFiles)
          })
        }
      }
    },
    [
      store,
      isControlled,
      onValueChange,
      onAccept,
      onFileAccept,
      onUpload,
      maxFiles,
      onFileValidate,
      onFileReject,
      acceptTypes,
      maxSize,
      disabled,
    ],
  )

  const onFilesUpload = React.useCallback(
    async (newFiles: File[]) => {
      try {
        for (const file of newFiles) {
          const id = Array.from(store.getState().files.entries()).find(([_, state]) => state.file === file)?.[0]
          if (id) {
            store.dispatch({ type: "SET_PROGRESS", id, progress: 0 })
          }
        }

        if (onUpload) {
          await onUpload(newFiles, {
            onProgress,
            onSuccess: (file) => {
              const id = Array.from(store.getState().files.entries()).find(([_, state]) => state.file === file)?.[0]
              if (id) {
                store.dispatch({ type: "SET_SUCCESS", id })
              }
            },
            onError: (file, error) => {
              const id = Array.from(store.getState().files.entries()).find(([_, state]) => state.file === file)?.[0]
              if (id) {
                store.dispatch({
                  type: "SET_ERROR",
                  id,
                  error: error.message ?? "Upload failed",
                })
              }
            },
          })
        } else {
          for (const file of newFiles) {
            const id = Array.from(store.getState().files.entries()).find(([_, state]) => state.file === file)?.[0]
            if (id) {
              store.dispatch({ type: "SET_SUCCESS", id })
            }
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Upload failed"
        for (const file of newFiles) {
          const id = Array.from(store.getState().files.entries()).find(([_, state]) => state.file === file)?.[0]
          if (id) {
            store.dispatch({
              type: "SET_ERROR",
              id,
              error: errorMessage,
            })
          }
        }
      }
    },
    [store, onUpload, onProgress],
  )

  const onInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? [])
      onFilesChange(files)
      event.target.value = ""
    },
    [onFilesChange],
  )

  const contextValue = React.useMemo<FileUploadContextValue>(
    () => ({
      dropzoneId,
      inputId,
      listId,
      labelId,
      dir,
      disabled,
      inputRef,
      urlCache,
    }),
    [dropzoneId, inputId, listId, labelId, dir, disabled, urlCache],
  )

  const RootPrimitive = asChild ? Slot : "div"

  return (
    <StoreContext.Provider value={store}>
      <FileUploadContext.Provider value={contextValue}>
        <RootPrimitive
          data-disabled={disabled ? "" : undefined}
          data-slot="file-upload"
          dir={dir}
          {...rootProps}
          className={cn("relative flex flex-col gap-2 w-full", className)}
        >
          {children}
          <input
            type="file"
            id={inputId}
            aria-labelledby={labelId}
            aria-describedby={dropzoneId}
            ref={inputRef}
            tabIndex={-1}
            accept={accept}
            name={name}
            className="sr-only"
            disabled={disabled}
            multiple={multiple}
            required={required}
            onChange={onInputChange}
          />
          <span id={labelId} className="sr-only">
            {label ?? "File upload"}
          </span>
        </RootPrimitive>
      </FileUploadContext.Provider>
    </StoreContext.Provider>
  )
}

interface FileUploadDropzoneProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
}

function FileUploadDropzone(props: FileUploadDropzoneProps) {
  const {
    asChild,
    className,
    onClick: onClickProp,
    onDragOver: onDragOverProp,
    onDragEnter: onDragEnterProp,
    onDragLeave: onDragLeaveProp,
    onDrop: onDropProp,
    onPaste: onPasteProp,
    onKeyDown: onKeyDownProp,
    ...dropzoneProps
  } = props

  const context = useFileUploadContext(DROPZONE_NAME)
  const store = useStoreContext(DROPZONE_NAME)
  const dragOver = useStore((state) => state.dragOver)
  const invalid = useStore((state) => state.invalid)

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      onClickProp?.(event)

      if (event.defaultPrevented) return

      const target = event.target

      const isFromTrigger = target instanceof HTMLElement && target.closest('[data-slot="file-upload-trigger"]')

      if (!isFromTrigger) {
        context.inputRef.current?.click()
      }
    },
    [context.inputRef, onClickProp],
  )

  const onDragOver = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDragOverProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.dispatch({ type: "SET_DRAG_OVER", dragOver: true })
    },
    [store, onDragOverProp],
  )

  const onDragEnter = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDragEnterProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.dispatch({ type: "SET_DRAG_OVER", dragOver: true })
    },
    [store, onDragEnterProp],
  )

  const onDragLeave = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDragLeaveProp?.(event)

      if (event.defaultPrevented) return

      const relatedTarget = event.relatedTarget
      if (relatedTarget && relatedTarget instanceof Node && event.currentTarget.contains(relatedTarget)) {
        return
      }

      event.preventDefault()
      store.dispatch({ type: "SET_DRAG_OVER", dragOver: false })
    },
    [store, onDragLeaveProp],
  )

  const onDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      onDropProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.dispatch({ type: "SET_DRAG_OVER", dragOver: false })

      const files = Array.from(event.dataTransfer.files)
      const inputElement = context.inputRef.current
      if (!inputElement) return

      const dataTransfer = new DataTransfer()
      for (const file of files) {
        dataTransfer.items.add(file)
      }

      inputElement.files = dataTransfer.files
      inputElement.dispatchEvent(new Event("change", { bubbles: true }))
    },
    [store, context.inputRef, onDropProp],
  )

  const onPaste = React.useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      onPasteProp?.(event)

      if (event.defaultPrevented) return

      event.preventDefault()
      store.dispatch({ type: "SET_DRAG_OVER", dragOver: false })

      const items = event.clipboardData?.items
      if (!items) return

      const files: File[] = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item?.kind === "file") {
          const file = item.getAsFile()
          if (file) {
            files.push(file)
          }
        }
      }

      if (files.length === 0) return

      const inputElement = context.inputRef.current
      if (!inputElement) return

      const dataTransfer = new DataTransfer()
      for (const file of files) {
        dataTransfer.items.add(file)
      }

      inputElement.files = dataTransfer.files
      inputElement.dispatchEvent(new Event("change", { bubbles: true }))
    },
    [store, context.inputRef, onPasteProp],
  )

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDownProp?.(event)

      if (!event.defaultPrevented && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault()
        context.inputRef.current?.click()
      }
    },
    [context.inputRef, onKeyDownProp],
  )

  const DropzonePrimitive = asChild ? Slot : "div"

  return (
    <DropzonePrimitive
      role="region"
      id={context.dropzoneId}
      aria-controls={`${context.inputId} ${context.listId}`}
      aria-disabled={context.disabled}
      aria-invalid={invalid}
      data-disabled={context.disabled ? "" : undefined}
      data-dragging={dragOver ? "" : undefined}
      data-invalid={invalid ? "" : undefined}
      data-slot="file-upload-dropzone"
      dir={context.dir}
      tabIndex={context.disabled ? undefined : 0}
      {...dropzoneProps}
      className={cn(
        "relative flex select-none flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 outline-none transition-colors hover:bg-accent/30 focus-visible:border-ring/50 data-[disabled]:pointer-events-none data-[dragging]:border-primary/30 data-[invalid]:border-destructive data-[dragging]:bg-accent/30 data-[invalid]:ring-destructive/20",
        className,
      )}
      onClick={onClick}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
    />
  )
}

interface FileUploadTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

function FileUploadTrigger(props: FileUploadTriggerProps) {
  const { asChild, onClick: onClickProp, ...triggerProps } = props
  const context = useFileUploadContext(TRIGGER_NAME)

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      onClickProp?.(event)

      if (event.defaultPrevented) return

      context.inputRef.current?.click()
    },
    [context.inputRef, onClickProp],
  )

  const TriggerPrimitive = asChild ? Slot : "button"

  return (
    <TriggerPrimitive
      type="button"
      aria-controls={context.inputId}
      data-disabled={context.disabled ? "" : undefined}
      data-slot="file-upload-trigger"
      {...triggerProps}
      disabled={context.disabled}
      onClick={onClick}
    />
  )
}

interface FileUploadListProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  orientation?: "horizontal" | "vertical"
  asChild?: boolean
  forceMount?: boolean
  children?: React.ReactNode | ((files: FileState[]) => React.ReactNode)
}

function FileUploadList(props: FileUploadListProps) {
  const { className, orientation = "vertical", asChild, forceMount, children, ...listProps } = props

  const context = useFileUploadContext(LIST_NAME)
  const fileCount = useStore((state) => state.files.size)
  const files = useStore((state) => Array.from(state.files.values()))

  const shouldRender = forceMount || fileCount > 0

  if (!shouldRender) return null

  const ListPrimitive = asChild ? Slot : "div"

  return (
    <ListPrimitive
      role="list"
      id={context.listId}
      aria-orientation={orientation}
      data-orientation={orientation}
      data-slot="file-upload-list"
      data-state={shouldRender ? "active" : "inactive"}
      dir={context.dir}
      {...listProps}
      className={cn(
        "data-[state=inactive]:fade-out-0 data-[state=active]:fade-in-0 data-[state=inactive]:slide-out-to-top-2 data-[state=active]:slide-in-from-top-2 flex flex-col gap-2 data-[state=active]:animate-in data-[state=inactive]:animate-out",
        orientation === "horizontal" && "flex-row overflow-x-auto p-1.5",
        className,
      )}
    >
      {isFunction(children) ? children(files) : <>{children}</>}
    </ListPrimitive>
  )
}

interface FileUploadItemContextValue {
  id: string
  fileState: FileState | undefined
  nameId: string
  sizeId: string
  statusId: string
  messageId: string
}

const FileUploadItemContext = React.createContext<FileUploadItemContextValue | null>(null)

function useFileUploadItemContext(consumerName: string) {
  const context = React.useContext(FileUploadItemContext)
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ITEM_NAME}\``)
  }
  return context
}

interface FileUploadItemProps extends React.ComponentPropsWithoutRef<"div"> {
  value: FileState
  asChild?: boolean
}

function FileUploadItem(props: FileUploadItemProps) {
  const { value, asChild, className, ...itemProps } = props
  const id = React.useId()
  const statusId = `${id}-status`
  const nameId = `${id}-name`
  const sizeId = `${id}-size`
  const messageId = `${id}-message`

  const context = useFileUploadContext(ITEM_NAME)
  // This is not optimized, but it works for now, we can improve it later if needed
  const files = useStore((state) => state.files)
  const fileState = value?.id
    ? files.get(value.id)
    : Array.from(files.values()).find((state) => {
        if (isFileItem(state.file) && isFileItem(value.file) && state.file.url === value.file.url) return true
        if (isFile(state.file) && isFile(value.file) && state.file === value.file) return true
        return false
      })

  const fileCount = useStore((state) => state.files.size)
  const fileIndex = Array.from(files.keys()).indexOf(fileState?.id ?? "") + 1

  const itemContext = React.useMemo(
    () => ({
      id,
      fileState,
      nameId,
      sizeId,
      statusId,
      messageId,
    }),
    [id, fileState, statusId, nameId, sizeId, messageId],
  )

  if (!fileState) return null

  const statusText = fileState.error
    ? `Error: ${fileState.error}`
    : fileState.status === "uploading"
      ? `Uploading: ${fileState.progress}% complete`
      : fileState.status === "success"
        ? "Upload complete"
        : "Ready to upload"

  const ItemPrimitive = asChild ? Slot : "div"

  return (
    <FileUploadItemContext.Provider value={itemContext}>
      <ItemPrimitive
        role="listitem"
        id={id}
        aria-setsize={fileCount}
        aria-posinset={fileIndex}
        aria-describedby={`${nameId} ${sizeId} ${statusId} ${fileState.error ? messageId : ""}`}
        aria-labelledby={nameId}
        data-slot="file-upload-item"
        dir={context.dir}
        {...itemProps}
        className={cn("relative flex items-center gap-2.5 rounded-md border p-3", className)}
      >
        <>{props.children}</>
        {/* <span id={statusId} className="sr-only">
          {statusText}
        </span> */}
      </ItemPrimitive>
    </FileUploadItemContext.Provider>
  )
}

export function formatBytes(bytes: number | undefined) {
  if (bytes === undefined || bytes === 0) return "0 B"
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(i ? 1 : 0)} ${sizes[i]}`
}

function getFileItemType(file: FileObjectType): string {
  // Prefer explicit MIME type if present
  if (isFile(file)) {
    return file.type ?? ""
  }
  if (isFileItem(file)) {
    if (file.type) return file.type
    // Fallback: infer from URL extension for common document types
    const url = file.url || ""
    const clean = url.split("#")[0].split("?")[0]
    const ext = clean.includes(".") ? (clean.split(".").pop()?.toLowerCase() ?? "") : ""

    const commonDocExts = new Set([
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "txt",
      "md",
      "rtf",
      "csv",
      "json",
      "xml",
    ])

    if (ext && commonDocExts.has(ext)) {
      return ext
    }
  }
  return ""
}

function getFileIcon(file: FileObjectType) {
  const type = getFileItemType(file)
  const nameOrUrl = isFileItem(file) ? file.url : file.name
  const extension = nameOrUrl?.split(".").pop()?.toLowerCase() ?? ""

  if (type.startsWith("video/")) {
    return <FileVideoIcon />
  }

  if (type.startsWith("audio/")) {
    return <FileAudioIcon />
  }

  if (type.startsWith("text/") || ["txt", "md", "rtf", "pdf"].includes(extension)) {
    return <FileTextIcon />
  }

  if (
    ["html", "css", "js", "jsx", "ts", "tsx", "json", "xml", "php", "py", "rb", "java", "c", "cpp", "cs"].includes(
      extension,
    )
  ) {
    return <FileCodeIcon />
  }

  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(extension)) {
    return <FileArchiveIcon />
  }

  if (["exe", "msi", "app", "apk", "deb", "rpm"].includes(extension) || type.startsWith("application/")) {
    return <FileCogIcon />
  }

  return <FileIcon />
}

interface FileUploadItemPreviewProps extends React.ComponentPropsWithoutRef<"div"> {
  render?: (file: FileObjectType) => React.ReactNode
  asChild?: boolean
}

function FileUploadItemPreview(props: FileUploadItemPreviewProps) {
  const { render, asChild, children, className, ...previewProps } = props

  const itemContext = useFileUploadItemContext(ITEM_PREVIEW_NAME)
  const context = useFileUploadContext(ITEM_PREVIEW_NAME)

  const onPreviewRender = React.useCallback(
    (file: FileObjectType) => {
      if (render) return render(file)

      if (isFileItem(file) && file.url) {
        const type = getFileItemType(file)
        const isImageByType = typeof type === "string" && type.startsWith("image/")
        const isImageByExt = /\.(apng|avif|gif|jpe?g|jfif|pjpeg|pjp|png|svg|webp|bmp|ico|tiff?|heic)$/i.test(
          file.url.split("#")[0].split("?")[0],
        )

        if (isImageByType || isImageByExt) {
          return <img src={file.url} alt={file.name} className="size-full object-cover" />
        }

        return getFileIcon(file)
      }

      if (isFile(file) && file.type.startsWith("image/")) {
        let url: string = context.urlCache.get(file) ?? ""
        if (!url) {
          url = URL.createObjectURL(file)
          context.urlCache.set(file, url)
        }
        return <img src={url} alt={file.name} className="size-full object-cover" />
      }

      return getFileIcon(file)
    },
    [render, context.urlCache],
  )

  if (!itemContext.fileState) return null

  const ItemPreviewPrimitive = asChild ? Slot : "div"

  return (
    <ItemPreviewPrimitive
      aria-labelledby={itemContext.nameId}
      data-slot="file-upload-preview"
      {...previewProps}
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border bg-accent/50 [&>svg]:size-10",
        className,
      )}
    >
      {onPreviewRender(itemContext.fileState.file)}
      {children}
    </ItemPreviewPrimitive>
  )
}

interface FileUploadItemMetadataProps extends React.ComponentPropsWithoutRef<"div"> {
  asChild?: boolean
  size?: "default" | "sm"
}

function FileUploadItemMetadata(props: FileUploadItemMetadataProps) {
  const { asChild, size = "default", children, className, ...metadataProps } = props

  const context = useFileUploadContext(ITEM_METADATA_NAME)
  const itemContext = useFileUploadItemContext(ITEM_METADATA_NAME)

  if (!itemContext.fileState) return null

  const file = itemContext.fileState.file
  const fileSize = isFileItem(file) ? file.size : file.size

  const ItemMetadataPrimitive = asChild ? Slot : "div"

  return (
    <ItemMetadataPrimitive
      data-slot="file-upload-metadata"
      dir={context.dir}
      {...metadataProps}
      className={cn("flex min-w-0 flex-1 flex-col", className)}
    >
      {children ?? (
        <>
          <span
            id={itemContext.nameId}
            className={cn("truncate font-medium text-sm", size === "sm" && "font-normal text-[13px] leading-snug")}
          >
            {file.name}
          </span>
          <span
            id={itemContext.sizeId}
            className={cn("truncate text-muted-foreground text-xs", size === "sm" && "text-[11px] leading-snug")}
          >
            {formatBytes(fileSize)}
          </span>
          {itemContext.fileState.error && (
            <span id={itemContext.messageId} className="text-destructive text-xs">
              {itemContext.fileState.error}
            </span>
          )}
        </>
      )}
    </ItemMetadataPrimitive>
  )
}

interface FileUploadItemProgressProps extends React.ComponentPropsWithoutRef<"div"> {
  variant?: "linear" | "circular" | "fill"
  size?: number
  asChild?: boolean
  forceMount?: boolean
}

function FileUploadItemProgress(props: FileUploadItemProgressProps) {
  const { variant = "linear", size = 40, asChild, forceMount, className, ...progressProps } = props

  const itemContext = useFileUploadItemContext(ITEM_PROGRESS_NAME)

  if (!itemContext.fileState) return null

  const progress = itemContext.fileState.progress

  const shouldRender = forceMount || (progress !== 100 && progress !== 0)

  if (!shouldRender) return null

  const ItemProgressPrimitive = asChild ? Slot : "div"

  switch (variant) {
    case "circular": {
      const circumference = 2 * Math.PI * ((size - 4) / 2)
      const strokeDashoffset = circumference - (progress / 100) * circumference

      return (
        <ItemProgressPrimitive
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-valuetext={`${progress}%`}
          aria-labelledby={itemContext.nameId}
          data-slot="file-upload-progress"
          {...progressProps}
          className={cn("-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2", className)}
        >
          <svg
            className="rotate-[-90deg] transform"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            fill="none"
            stroke="currentColor"
          >
            <circle className="text-primary/20" strokeWidth="2" cx={size / 2} cy={size / 2} r={(size - 4) / 2} />
            <circle
              className="text-primary transition-[stroke-dashoffset] duration-300 ease-linear"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              cx={size / 2}
              cy={size / 2}
              r={(size - 4) / 2}
            />
          </svg>
        </ItemProgressPrimitive>
      )
    }

    case "fill": {
      const progressPercentage = itemContext.fileState.progress
      const topInset = 100 - progressPercentage

      return (
        <ItemProgressPrimitive
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
          aria-valuetext={`${progressPercentage}%`}
          aria-labelledby={itemContext.nameId}
          data-slot="file-upload-progress"
          {...progressProps}
          className={cn("absolute inset-0 bg-primary/50 transition-[clip-path] duration-300 ease-linear", className)}
          style={{
            clipPath: `inset(${topInset}% 0% 0% 0%)`,
          }}
        />
      )
    }

    default:
      return (
        <ItemProgressPrimitive
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={itemContext.fileState.progress}
          aria-valuetext={`${itemContext.fileState.progress}%`}
          aria-labelledby={itemContext.nameId}
          data-slot="file-upload-progress"
          {...progressProps}
          className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-primary/20", className)}
        >
          <div
            className="h-full w-full flex-1 bg-primary transition-transform duration-300 ease-linear"
            style={{
              transform: `translateX(-${100 - itemContext.fileState.progress}%)`,
            }}
          />
        </ItemProgressPrimitive>
      )
  }
}

interface FileUploadItemDeleteProps extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean
}

function FileUploadItemDelete(props: FileUploadItemDeleteProps) {
  const { asChild, onClick: onClickProp, ...deleteProps } = props

  const store = useStoreContext(ITEM_DELETE_NAME)
  const itemContext = useFileUploadItemContext(ITEM_DELETE_NAME)
  const rootProps = FileUploadRoot as unknown as { onRemoveExisting?: (file: FileItem) => Promise<void> | void } // Hack to access prop

  const onClick = React.useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      onClickProp?.(event)

      if (!itemContext.fileState || event.defaultPrevented) return

      const file = itemContext.fileState.file
      if (isFileItem(file) && rootProps.onRemoveExisting) {
        await rootProps.onRemoveExisting(file)
      }

      store.dispatch({
        type: "REMOVE_FILE",
        id: itemContext.fileState.id,
      })
    },
    [store, itemContext.fileState, onClickProp, rootProps.onRemoveExisting],
  )

  if (!itemContext.fileState) return null

  const ItemDeletePrimitive = asChild ? Slot : "button"

  return (
    <ItemDeletePrimitive
      type="button"
      aria-controls={itemContext.id}
      aria-describedby={itemContext.nameId}
      data-slot="file-upload-item-delete"
      {...deleteProps}
      onClick={onClick}
    />
  )
}

interface FileUploadClearProps extends React.ComponentPropsWithoutRef<"button"> {
  forceMount?: boolean
  asChild?: boolean
}

function FileUploadClear(props: FileUploadClearProps) {
  const { asChild, forceMount, disabled, onClick: onClickProp, ...clearProps } = props

  const context = useFileUploadContext(CLEAR_NAME)
  const store = useStoreContext(CLEAR_NAME)
  const fileCount = useStore((state) => state.files.size)

  const isDisabled = disabled || context.disabled

  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      onClickProp?.(event)

      if (event.defaultPrevented) return

      store.dispatch({ type: "CLEAR" })
    },
    [store, onClickProp],
  )

  const shouldRender = forceMount || fileCount > 0

  if (!shouldRender) return null

  const ClearPrimitive = asChild ? Slot : "button"

  return (
    <ClearPrimitive
      type="button"
      aria-controls={context.listId}
      data-slot="file-upload-clear"
      data-disabled={isDisabled ? "" : undefined}
      {...clearProps}
      disabled={isDisabled}
      onClick={onClick}
    />
  )
}

export {
  FileUploadRoot as FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadItemPreview,
  FileUploadItemMetadata,
  FileUploadItemProgress,
  FileUploadItemDelete,
  FileUploadClear,
  //
  FileUploadRoot as Root,
  FileUploadDropzone as Dropzone,
  FileUploadTrigger as Trigger,
  FileUploadList as List,
  FileUploadItem as Item,
  FileUploadItemPreview as ItemPreview,
  FileUploadItemMetadata as ItemMetadata,
  FileUploadItemProgress as ItemProgress,
  FileUploadItemDelete as ItemDelete,
  FileUploadClear as Clear,
  //
  useStore as useFileUpload,
  //
  type FileUploadRootProps as FileUploadProps,
  type FileItem,
  type FileObjectType as UploadFile,
}
