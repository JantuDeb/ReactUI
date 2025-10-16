import { type ChangeEvent, type MouseEvent, useCallback, useEffect, useRef, useState } from "react"

import { type TRowData, type TTableInstance } from "../../types"
import { parseFromValuesOrFunc } from "../../utils/utils"
import { TextField, TextFieldProps } from "../../../inputs/input"
import { cn, debounce } from "../../../lib/utils"
// import { MRT_FilterOptionMenu } from "../menus/MRT_FilterOptionMenu"

export interface GlobalFilterTextFieldProps<TData extends TRowData> extends TextFieldProps {
  table: TTableInstance<TData>
}

export const GlobalFilterTextField = <TData extends TRowData>({
  table,
  ...rest
}: GlobalFilterTextFieldProps<TData>) => {
  const {
    getState,
    options: {
      enableGlobalFilterModes,
      icons: { CloseIcon, SearchIcon },
      localization,
      manualFiltering,
      searchTextFieldProps,
    },
    refs: { searchInputRef },
    setGlobalFilter,
  } = table
  const { globalFilter, showGlobalFilter } = getState()

  const textFieldProps = {
    ...parseFromValuesOrFunc(searchTextFieldProps, {
      table,
    }),
    ...rest,
  }

  const isMounted = useRef(false)
  //   const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [searchValue, setSearchValue] = useState(globalFilter ?? "")

  const handleChangeDebounced = useCallback(
    debounce(
      (event: ChangeEvent<HTMLInputElement>) => {
        setGlobalFilter(event.target.value ?? undefined)
      },
      manualFiltering ? 500 : 250,
    ),
    [],
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
    handleChangeDebounced(event)
  }

  //   const handleGlobalFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
  //     setAnchorEl(event.currentTarget)
  //   }

  const handleClear = () => {
    setSearchValue("")
    setGlobalFilter(undefined)
  }

  useEffect(() => {
    if (isMounted.current) {
      if (globalFilter === undefined) {
        handleClear()
      } else {
        setSearchValue(globalFilter)
      }
    }
    isMounted.current = true
  }, [globalFilter])

  return (
    // <Collapse in={showGlobalFilter} mountOnEnter orientation="horizontal" unmountOnExit>
    <TextField
      autoComplete="off"
      className={cn("transition-[width] delay-150 duration-300 ease-in-out", showGlobalFilter ? "" : "hidden")}
      {...textFieldProps}
      onChange={handleChange}
      placeholder={localization.search}
      value={searchValue ?? ""}
      ref={(inputRef) => {
        searchInputRef.current = inputRef
        if (textFieldProps?.ref) {
          //@ts-ignore
          textFieldProps.ref = inputRef
        }
      }}
    />
    // </Collapse>
  )
}
//      {/* <MRT_FilterOptionMenu anchorEl={anchorEl} onSelect={handleClear} setAnchorEl={setAnchorEl} table={table} /> */}
