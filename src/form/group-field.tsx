import React from "react"
import { FieldValues } from "react-hook-form"
import { cn } from "../lib/utils"
import { GroupFieldConfig, AnyFieldConfig } from "./types"

interface GroupFieldProps<TFieldValues extends FieldValues> {
  fieldKey: string
  fieldConfig: GroupFieldConfig<TFieldValues, any>
  pathPrefix?: string
  renderField: (props: {
    fieldKey: string
    fieldConfig: AnyFieldConfig<TFieldValues>
    pathPrefix?: string
  }) => React.ReactNode
}

export const GroupField = <TFieldValues extends FieldValues>({
  fieldKey,
  fieldConfig,
  pathPrefix = "",
  renderField,
}: GroupFieldProps<TFieldValues>) => {
  const { layout = "vertical", fields, gridLayout } = fieldConfig

  const fullPath = pathPrefix ? `${pathPrefix}.${fieldKey}` : fieldKey

  const isHorizontal = layout === "horizontal"
  const isGrid = layout === "grid"
  const cols = gridLayout?.cols || 12
  const spans = gridLayout?.spans || {}

  // Use explicit Tailwind classes instead of dynamic string interpolation
  const getContainerClass = () => {
    if (isGrid) {
      return cn("p-4 border rounded grid gap-4 w-full", {
        "grid-cols-1": cols === 1,
        "grid-cols-2": cols === 2,
        "grid-cols-3": cols === 3,
        "grid-cols-4": cols === 4,
        "grid-cols-5": cols === 5,
        "grid-cols-6": cols === 6,
        "grid-cols-7": cols === 7,
        "grid-cols-8": cols === 8,
        "grid-cols-9": cols === 9,
        "grid-cols-10": cols === 10,
        "grid-cols-11": cols === 11,
        "grid-cols-12": cols === 12,
      })
    }
    if (isHorizontal) {
      return "p-4 border rounded flex flex-row gap-4 w-full"
    }
    return "p-4 border rounded flex flex-col gap-4 w-full"
  }

  const getFieldSpanClass = (subFieldKey: string) => {
    if (!isGrid) return ""
    const span = spans[subFieldKey] || cols

    // Map span values to explicit Tailwind classes
    const spanClasses: Record<number, string> = {
      1: "col-span-1",
      2: "col-span-2",
      3: "col-span-3",
      4: "col-span-4",
      5: "col-span-5",
      6: "col-span-6",
      7: "col-span-7",
      8: "col-span-8",
      9: "col-span-9",
      10: "col-span-10",
      11: "col-span-11",
      12: "col-span-12",
    }

    return spanClasses[span] || "col-span-12"
  }

  return (
    <div className={getContainerClass()}>
      {Object.entries(fields).map(([subFieldKey, subFieldConfig]) => (
        <div key={subFieldKey} className={getFieldSpanClass(subFieldKey)}>
          {renderField({
            fieldKey: subFieldKey,
            fieldConfig: subFieldConfig as AnyFieldConfig<TFieldValues>,
            pathPrefix: fullPath,
          })}
        </div>
      ))}
    </div>
  )
}
