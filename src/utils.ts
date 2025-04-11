import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export async function delayInSeconds(duration = 0): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), duration * 1000)
  })
}

type Primitive = string | number | boolean | null | undefined
type JsonValue = Primitive | JsonArray | JsonObject
interface JsonObject {
  [key: string]: JsonValue
}

interface JsonArray extends Array<JsonValue> {}

type ReactElement = {
  $$typeof: symbol
  [key: string]: unknown
}

export function isObjectsEqual(obj1: unknown, obj2: unknown): boolean {
  if (obj1 === obj2) {
    return true
  } else if (
    typeof obj1 === "object" &&
    obj1 != null &&
    typeof obj2 === "object" &&
    obj2 != null
  ) {
    const obj1AsObject = obj1 as Record<string, unknown>
    const obj2AsObject = obj2 as Record<string, unknown>

    if (Object.keys(obj1AsObject).length != Object.keys(obj2AsObject).length)
      return false

    for (const prop in obj1AsObject) {
      if (Object.prototype.hasOwnProperty.call(obj2AsObject, prop)) {
        if (
          Array.isArray(obj1AsObject[prop]) &&
          Array.isArray(obj2AsObject[prop])
        ) {
          // If both values are arrays, sort them and compare
          if (
            !isArraysEqual(
              [...(obj1AsObject[prop] as unknown[])].sort(),
              [...(obj2AsObject[prop] as unknown[])].sort(),
            )
          ) {
            return false
          }
        } else {
          // If the values are not arrays, use the original comparison function
          if (!isObjectsEqual(obj1AsObject[prop], obj2AsObject[prop]))
            return false
        }
      } else {
        return false
      }
    }
    return true
  } else {
    return false
  }
}

export function isArraysEqual<T>(arr1: T[] = [], arr2: T[] = []): boolean {
  if (arr1.length !== arr2.length) return false
  for (let i = 0; i < arr1.length; i++) {
    if (!isObjectsEqual(arr1[i], arr2[i])) return false
  }
  return true
}

export function getQueryString(url: string | undefined): string | undefined {
  return url?.substring(url?.indexOf("?") + 1)
}

export function deepCopyObject<T extends JsonValue>(obj: T): T {
  if (
    typeof obj !== "object" ||
    obj === null ||
    (obj as ReactElement).$$typeof === Symbol.for("react.element")
  ) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepCopyObject(item)) as T
  }

  const copiedObject = {} as Record<string, JsonValue>
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copiedObject[key] = deepCopyObject(
        (obj as Record<string, JsonValue>)[key],
      )
    }
  }
  return copiedObject as T
}

export function mergeObjects<T extends object, U extends object>(
  ...objects: [T, U]
): T & U {
  return Object.assign({}, ...objects)
}

export function getQueryParams(urlString: string): Record<string, string> {
  const queryString = urlString.includes("?")
    ? urlString.split("?")[1]
    : urlString

  if (!queryString) return {}

  const pairs = queryString.split("&")
  return pairs.reduce<Record<string, string>>((acc, pair) => {
    const [key, value] = pair.split("=")
    if (key) {
      acc[key] = value ?? ""
    }
    return acc
  }, {})
}

function parseQueryParamValue(value = ""): string | string[] {
  return value.includes(",") ? value.split(",") : value
}

export function getQueryParamsFromUrl(
  url = "",
): Record<string, string | string[]> {
  if (url?.includes("?")) [, url] = url.split("?")
  const searchParams = new URLSearchParams(url)
  const queryParams: Record<string, string | string[]> = {}
  for (const pair of searchParams.entries()) {
    const [key, value] = pair
    queryParams[key] = parseQueryParamValue(value)
  }
  return queryParams
}

export const isFloat = (x: number): boolean => !!(x % 1)

export const mapObjectToArray = <T extends object>(
  object: Record<string, T>,
  sortKey?: keyof T & string,
): (T & { key: string })[] => {
  const results: (T & { key: string })[] = []

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const element = object[key]
      results.push({ ...element, key })
    }
  }

  if (sortKey) {
    results.sort((a, b) => {
      const aValue = a[sortKey]
      const bValue = b[sortKey]
      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue)
      }
      return 0
    })
  }

  return results
}

export function isNullOrEmpty(testObject: unknown): boolean {
  if (!testObject) return true
  if (Array.isArray(testObject)) {
    return testObject.length === 0
  }
  if (typeof testObject === "object" && testObject !== null) {
    return Object.keys(testObject).length === 0
  }
  return false
}

export function isNull(value: unknown): value is null | undefined {
  return value === null || value === undefined
}

export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined
}

export function isEmpty(obj: unknown): boolean {
  if (Array.isArray(obj)) {
    return obj.length === 0
  }
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).length === 0
  }
  return false
}

export function filterObjects<T>(
  objects: Record<string, T> | undefined,
  cb: (value: T, key: string) => boolean,
): Record<string, T> | undefined {
  if (!objects) return undefined

  const inputObjects = deepCopyObject(
    objects as unknown as JsonValue,
  ) as Record<string, T>
  const newObjects: Record<string, T> = {}

  for (const key in inputObjects) {
    if (Object.prototype.hasOwnProperty.call(inputObjects, key)) {
      if (cb(inputObjects[key], key)) {
        newObjects[key] = inputObjects[key]
      }
    }
  }

  return newObjects
}

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P]
}

export function filterUndefinedFromObject<T extends object>(
  obj: T,
  maxDepth = Infinity,
): RecursivePartial<T> {
  function recursiveFilter(value: unknown, currentDepth: number): unknown {
    if (Array.isArray(value)) {
      const filteredArray = value
        .map((item) => recursiveFilter(item, currentDepth + 1))
        .filter((item) => item !== undefined)
      return filteredArray.length ? filteredArray : undefined
    }

    if (isObject(value) && currentDepth < maxDepth) {
      const filteredObj: Record<string, unknown> = {}
      Object.keys(value as object).forEach((key) => {
        const filteredValue = recursiveFilter(
          (value as Record<string, unknown>)[key],
          currentDepth + 1,
        )
        if (filteredValue !== undefined) {
          filteredObj[key] = filteredValue
        }
      })
      return Object.keys(filteredObj).length ? filteredObj : undefined
    }

    return value
  }

  return (recursiveFilter(obj, 0) as RecursivePartial<T>) || {}
}

export function isFunction<T extends (...args: never[]) => unknown>(
  value: unknown,
): value is T {
  return typeof value === "function"
}

export function isString(value: unknown): value is string {
  return typeof value === "string"
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value)
}

export const isBoolean = (value: unknown): value is boolean =>
  typeof value === "boolean"

export const isArray = <T>(value: unknown): value is T[] => Array.isArray(value)

export function isObject(value: unknown): value is object {
  if (typeof value !== "object" || value === null) {
    return false
  }
  return Object.getPrototypeOf(value) === Object.prototype
}
