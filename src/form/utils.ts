import { FieldValues } from "react-hook-form"
import { AnyFieldConfig, FieldCondition, SliderFieldConfig } from "./types"

// Resolve a dot-separated path like "address.city" against an object
function getValueAtPath(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj)
}

export function evaluateCondition(condition: FieldCondition, values: Record<string, any>): boolean {
  if ("and" in condition) return condition.and.every((c) => evaluateCondition(c, values))
  if ("or" in condition) return condition.or.some((c) => evaluateCondition(c, values))
  if ("not" in condition) return !evaluateCondition(condition.not, values)

  const { field, operator, value } = condition
  const fieldValue = getValueAtPath(values, field)

  switch (operator) {
    case "eq":      return fieldValue === value
    case "neq":     return fieldValue !== value
    case "in":      return Array.isArray(value) && value.includes(fieldValue)
    case "nin":     return Array.isArray(value) && !value.includes(fieldValue)
    case "gt":      return fieldValue > value
    case "gte":     return fieldValue >= value
    case "lt":      return fieldValue < value
    case "lte":     return fieldValue <= value
    case "empty":   return fieldValue == null || fieldValue === "" || (Array.isArray(fieldValue) && fieldValue.length === 0)
    case "notempty":return fieldValue != null && fieldValue !== "" && !(Array.isArray(fieldValue) && fieldValue.length === 0)
    default:        return true
  }
}

// Utility functions for flattening/unflattening objects
export const flattenObject = <T extends object>(obj: T, prefix = ""): T => {
  return Object.keys(obj).reduce((acc: any, k) => {
    const pre = prefix.length ? prefix + "." : ""
    const o = (obj as any)[k]
    if (typeof o === "object" && o !== null && !Array.isArray(o) && !(o instanceof Date) && !(o instanceof File)) {
      Object.assign(acc, flattenObject(o, pre + k))
    } else {
      acc[pre + k] = o
    }
    return acc
  }, {})
}

export const unflattenObject = <T>(obj: T): T => {
  const result: any = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const keys = key.split(".")
      keys.reduce((acc, current, index) => {
        if (index === keys.length - 1) {
          acc[current] = obj[key]
        } else {
          if (!acc[current] || typeof acc[current] !== "object") {
            acc[current] = /^[0-9]+$/.test(keys[index + 1]) ? [] : {}
          }
          return acc[current]
        }
        return acc
      }, result)
    }
  }
  return result
}

export const getFieldDefaultValue = <TFieldValues extends FieldValues>(
  fieldConfig: AnyFieldConfig<TFieldValues>,
): any => {
  const configValue =
    "value" in fieldConfig || "defaultValue" in fieldConfig
      ? (fieldConfig.value ?? fieldConfig.defaultValue)
      : undefined

  // Return appropriate defaults based on field type
  if (configValue !== undefined) return configValue

  switch (fieldConfig.type) {
    case "multiselect":
    case "array":
      return []
    case "checkbox":
    case "switch":
      return false
    case "slider":
      const sliderConfig = fieldConfig as SliderFieldConfig<TFieldValues>
      return sliderConfig.min ?? 0
    case "group":
      return {}
    default:
      return undefined
  }
}
