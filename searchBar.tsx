import React, { RefObject } from "react"
import { ReactNode } from "react"
import Button from "@common/button"
import Svg from "@common/svg"

type SearchBarProps = {
  onChange: (text: string) => void
  onSubmit?: (text: string) => void
  renderHelpContent?: () => ReactNode
  value?: string
  onClearInput?: () => void
  placeholder?: string
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  ref?: RefObject<HTMLInputElement>
}

function SearchBar({
  onChange,
  onSubmit,
  // renderHelpContent,
  value = "",
  onClearInput,
  placeholder = "Search",
  handleKeyDown,
  ref,
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(value)
  }

  return (
    <div className="shrink-0 flex">
      <form className="w-full flex" onSubmit={handleSubmit}>
        <label htmlFor="search_field" className="sr-only">
          Search
        </label>
        <div className="relative w-full focus-within:text-primary">
          <div className="absolute top-2 left-3 flex items-center pointer-events-none">
            <Svg name="search" className="h-5 w-5" viewBox="0 0 20 20" />
          </div>
          <input
            ref={ref}
            id="search_field"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-background  focus-visible:outline-none focus-visible:border-primary block w-full h-full pl-10 pr-3 py-[7px] rounded-xl text-primary font-medium placeholder:text-secondary-dark border"
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.code === "Space") e.stopPropagation()
              handleKeyDown?.(e)
            }}
            type={onClearInput ? "text" : "search"}
            autoComplete="off"
          />
          {value && onClearInput && (
            <div className="absolute inset-y-0 right-0 flex items-center cursor-pointer transform hover:scale-110">
              <Button
                variant="minimal"
                size="icon"
                type="button"
                onClick={onClearInput}
              >
                <Svg
                  name="cross"
                  className="h-5 w-5"
                  tooltipContent={undefined}
                />
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export default SearchBar
