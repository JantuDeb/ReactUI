import { Option, Options } from "../../types"

export const parseFromValuesOrFunc = <T, U>(
  fn: ((arg: U) => T) | T | undefined,
  arg: U,
): T | undefined => (fn instanceof Function ? fn(arg) : fn)

export const getValueAndLabel = (
  option?: Option | null,
): { label: string; value: string } => {
  let label: string = ""
  let value: string = ""
  if (option) {
    if (typeof option !== "object") {
      label = option
      value = option
    } else {
      label = (option.display as string) ?? (option.key as string)
      value = option.key ?? label
    }
  }
  return { label, value }
}
