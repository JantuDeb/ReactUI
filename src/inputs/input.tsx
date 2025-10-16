import * as React from "react"
import { cn } from "../lib/utils"

function InputBase({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  )
}

export type TextFieldProps = React.ComponentProps<"input"> & {
  startAdorment?: React.ReactNode
  endAdorment?: React.ReactNode
}

const TextField = ({ startAdorment, endAdorment, ...props }: TextFieldProps) => {
  return (
    <div className="relative">
      <InputBase className="peer ps-17 pe-13" {...props} />
      {startAdorment && (
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
          {startAdorment}
        </div>
      )}
      {endAdorment && (
        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
          {endAdorment}
        </div>
      )}
    </div>
  )
}

export { InputBase as Input, TextField }
