import clsx, { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isFunction(obj: any): obj is Function {
  return obj instanceof Function
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number,
  targetWindow: Window = window,
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId !== undefined) {
      targetWindow.clearTimeout(timeoutId)
    }

    timeoutId = targetWindow.setTimeout(() => {
      fn.apply(this, args)
    }, ms)
  }
}
