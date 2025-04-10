import PopoverMenuStyled from "@common/v2/dropdowns/popoverMenu"
import Svg from "@common/svg"
import React, { useState } from "react"

const ShowHideColumnMenu = ({ table }) => {
  const allColumns = table
    .getAllLeafColumns()
    .filter((col) => col.columnDef.type !== "display")

  const [options, setOptions] = useState(() =>
    allColumns?.reduce((options, col) => {
      return {
        ...options,
        [col.id]: {
          key: col.id,
          display: col.columnDef.header || col.id,
          selected: col.getIsVisible(), // ? "check" : "",
        },
      }
    }, {})
  )

  const handleSelect = (key) => {
    allColumns.find((col) => col.id === key)?.toggleVisibility()
    setOptions((prevOptions) => ({
      ...prevOptions,
      [key]: {
        ...prevOptions[key],
        selected: !prevOptions[key].selected,
      },
    }))
  }

  const buttonOverride = (
    <div className="rounded-md transition-colors active:scale-[0.99] hover:bg-muted  h-8 w-8 flex items-center justify-center">
      <Svg
        name="adjust"
        classes="h-5 w-5 text-gray-600 dark:text-gray-500"
        fill="currentColor"
      />
    </div>
  )
  return (
    <PopoverMenuStyled
      options={options}
      onSelect={handleSelect}
      isMultiSelect
      position="auto-start"
      showCheckbox
    >
      {buttonOverride}
    </PopoverMenuStyled>
  )
}

export default ShowHideColumnMenu
