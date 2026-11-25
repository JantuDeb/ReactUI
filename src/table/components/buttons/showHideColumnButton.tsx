import { type MouseEvent, useState } from "react"

import { type TRowData, type TTableInstance } from "../../types"
// import { MRT_ShowHideColumnsMenu } from "../menus/MRT_ShowHideColumnsMenu"
import { Button, ButtonProps } from "../../../buttons/button"
import { ShowHideColumnsMenu } from "../menus/showHideColumnMenu"

export interface ShowHideColumnsButtonProps<TData extends TRowData> extends ButtonProps {
  table: TTableInstance<TData>
}

export const ShowHideColumnsButton = <TData extends TRowData>({
  table,
  title = "Show/Hide Columns",
}: ShowHideColumnsButtonProps<TData>) => {
  const {
    options: {
      icons: { ViewColumnIcon },
      localization,
    },
  } = table

  return (
    <>
      <ShowHideColumnsMenu table={table}>
        <Button
          aria-label={localization.showHideColumns || title}
          // size="icon"
          variant="ghost"
          // {...rest}
          tooltip={localization.showHideColumns || title}
        >
          <ViewColumnIcon />
        </Button>
      </ShowHideColumnsMenu>
    </>
  )
}
