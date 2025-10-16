import { FieldValues, Path, PathValue } from "react-hook-form"
import { FormConfig, AnyFieldConfig, ValidationConfig, FieldConfigMap } from "./types-v2"

// === PATH UTILITIES ===
export const constructPath = (prefix: string | undefined, fieldName: string): string => {
  return prefix ? `${prefix}.${fieldName}` : fieldName
}

export const getNestedValue = <T extends Record<string, any>>(obj: T, path: string): any => {
  return path.split(".").reduce((current, key) => {
    return current?.[key]
  }, obj)
}

export const setNestedValue = <T extends Record<string, any>>(obj: T, path: string, value: any): T => {
  const keys = path.split(".")
  const result = { ...obj }

  let current = result
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== "object") {
      current[key] = {}
    } else {
      current[key] = { ...current[key] }
    }
    current = current[key]
  }

  current[keys[keys.length - 1]] = value
  return result
}

// === VALIDATION UTILITIES ===
export const createAsyncValidator = <TFormValues extends FieldValues>(
  asyncFn: (value: any, formValues: TFormValues) => Promise<boolean | string>,
  debounceMs = 300,
) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (value: any, formValues: TFormValues): Promise<boolean | string> => {
    return new Promise((resolve) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(async () => {
        try {
          const result = await asyncFn(value, formValues)
          resolve(result)
        } catch (error) {
          resolve(`Validation error: ${error instanceof Error ? error.message : "Unknown error"}`)
        }
      }, debounceMs)
    })
  }
}

export const combineValidators = <TFormValues extends FieldValues>(
  ...validators: Array<ValidationConfig<TFormValues>["validate"]>
): ValidationConfig<TFormValues>["validate"] => {
  return async (value: any, formValues: TFormValues) => {
    for (const validator of validators) {
      if (validator) {
        const result = await validator(value, formValues)
        if (result !== true) {
          return result
        }
      }
    }
    return true
  }
}

// === FORM BUILDER UTILITIES ===
export const createFieldConfig = <TFormValues extends FieldValues>(
  baseConfig: Partial<AnyFieldConfig<TFormValues>>,
): AnyFieldConfig<TFormValues> => {
  return {
    type: "input",
    ...baseConfig,
  } as AnyFieldConfig<TFormValues>
}

export const createFormConfig = <TFormValues extends FieldValues>(
  fields: FieldConfigMap<TFormValues>,
  options?: Partial<Omit<FormConfig<TFormValues>, "fields">>,
): FormConfig<TFormValues> => {
  return {
    fields,
    fieldOrder: Object.keys(fields),
    ...options,
  }
}

// === FIELD CONFIG BUILDERS ===
export const inputField = <TFormValues extends FieldValues>(
  config: Omit<AnyFieldConfig<TFormValues>, "type"> & {
    inputType?: React.HTMLInputTypeAttribute
  },
): AnyFieldConfig<TFormValues> =>
  ({
    ...config,
    type: "input",
  }) as AnyFieldConfig<TFormValues>

export const textareaField = <TFormValues extends FieldValues>(
  config: Omit<AnyFieldConfig<TFormValues>, "type"> & {
    rows?: number
    cols?: number
    resize?: "none" | "vertical" | "horizontal" | "both"
  },
): AnyFieldConfig<TFormValues> =>
  ({
    ...config,
    type: "textarea",
  }) as AnyFieldConfig<TFormValues>

export const selectField = <TFormValues extends FieldValues>(
  config: Omit<AnyFieldConfig<TFormValues>, "type"> & {
    options: Array<{ value: string; label: string }>
    // searchable?: boolean
    // clearable?: boolean
    // createable?: boolean
  },
): AnyFieldConfig<TFormValues> =>
  ({
    ...config,
    type: "select",
  }) as AnyFieldConfig<TFormValues>

export const checkboxField = <TFormValues extends FieldValues>(
  config: Omit<AnyFieldConfig<TFormValues>, "type"> & {
    checkboxLabel?: string
  },
): AnyFieldConfig<TFormValues> =>
  ({
    ...config,
    type: "checkbox",
  }) as AnyFieldConfig<TFormValues>

export const radioField = <TFormValues extends FieldValues>(
  config: Omit<AnyFieldConfig<TFormValues>, "type"> & {
    options: Array<{ value: string; label: string }>
    direction?: "horizontal" | "vertical"
  },
): AnyFieldConfig<TFormValues> =>
  ({
    ...config,
    type: "radio",
  }) as AnyFieldConfig<TFormValues>

export const groupField = <TFormValues extends FieldValues>(
  config: Omit<AnyFieldConfig<TFormValues>, "type"> & {
    fields: FieldConfigMap<any>
    layout?: "horizontal" | "vertical" | "grid"
    collapsible?: boolean
    defaultCollapsed?: boolean
  },
): AnyFieldConfig<TFormValues> =>
  ({
    ...config,
    type: "group",
  }) as AnyFieldConfig<TFormValues>

export const arrayField = <TFormValues extends FieldValues>(
  config: Omit<AnyFieldConfig<TFormValues>, "type"> & {
    itemConfig: FieldConfigMap<any>
    minItems?: number
    maxItems?: number
    addLabel?: string
    removeLabel?: string
    reorderable?: boolean
  },
): AnyFieldConfig<TFormValues> =>
  ({
    ...config,
    type: "array",
  }) as AnyFieldConfig<TFormValues>

export const infoField = <TFormValues extends FieldValues>(
  config: Omit<AnyFieldConfig<TFormValues>, "type"> & {
    variant?: "info" | "warning" | "error" | "success"
    title?: string
    message?: string | React.ReactNode
  },
): AnyFieldConfig<TFormValues> =>
  ({
    ...config,
    type: "info",
  }) as AnyFieldConfig<TFormValues>

// === VALIDATION BUILDERS ===
export const required = (message = "This field is required"): Pick<ValidationConfig, "required"> => ({
  required: message,
})

export const minLength = (length: number, message?: string): Pick<ValidationConfig, "minLength"> => ({
  minLength: message ? { value: length, message } : length,
})

export const maxLength = (length: number, message?: string): Pick<ValidationConfig, "maxLength"> => ({
  maxLength: message ? { value: length, message } : length,
})

export const pattern = (regex: RegExp, message?: string): Pick<ValidationConfig, "pattern"> => ({
  pattern: message ? { value: regex, message } : regex,
})

export const email = (message = "Please enter a valid email address"): Pick<ValidationConfig, "pattern"> => ({
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message,
  },
})

export const url = (message = "Please enter a valid URL"): Pick<ValidationConfig, "pattern"> => ({
  pattern: {
    value: /^https?:\/\/.+\..+$/,
    message,
  },
})

export const phone = (message = "Please enter a valid phone number"): Pick<ValidationConfig, "pattern"> => ({
  pattern: {
    value: /^\+?[\d\s\-\(\)]+$/,
    message,
  },
})

// === TYPE-SAFE DEFAULT VALUES ===
export const createDefaultValues = <TFormValues extends FieldValues>(
  config: FormConfig<TFormValues>,
): Partial<TFormValues> => {
  const defaults: Record<string, any> = {}

  const processFields = (fields: FieldConfigMap<any>, prefix = "") => {
    Object.entries(fields).forEach(([key, fieldConfig]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key

      if (fieldConfig.type === "info") return

      if (fieldConfig.defaultValue !== undefined) {
        setNestedValue(defaults, fullKey, fieldConfig.defaultValue)
      }

      // Handle nested fields
      if (fieldConfig.type === "group" && "fields" in fieldConfig) {
        processFields(fieldConfig.fields, fullKey)
      } else if (fieldConfig.type === "array" && "itemConfig" in fieldConfig) {
        // Arrays start empty by default, but we could set default items here
        defaults[fullKey] = []
      }
    })
  }

  processFields(config.fields)
  return defaults as Partial<TFormValues>
}

// === FORM STATE UTILITIES ===
export const getFieldErrors = <TFormValues extends FieldValues>(errors: any, fieldPath: string): string[] => {
  const fieldError = getNestedValue(errors, fieldPath)
  if (!fieldError) return []

  if (typeof fieldError === "string") return [fieldError]
  if (fieldError.message) return [fieldError.message]
  if (Array.isArray(fieldError))
    return fieldError
      .filter(Boolean)
      .map((e) => e.message || e)
      .filter(Boolean)

  return []
}

export const hasFieldError = <TFormValues extends FieldValues>(errors: any, fieldPath: string): boolean => {
  return getFieldErrors(errors, fieldPath).length > 0
}

// === FORM TRANSFORMATION UTILITIES ===
export const transformFormData = <TInput, TOutput>(data: TInput, transformer: (data: TInput) => TOutput): TOutput => {
  return transformer(data)
}

export const flattenFormData = (data: Record<string, any>, prefix = ""): Record<string, any> => {
  const result: Record<string, any> = {}

  Object.entries(data).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      Object.assign(result, flattenFormData(value, fullKey))
    } else {
      result[fullKey] = value
    }
  })

  return result
}

// === PERFORMANCE UTILITIES ===
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), wait)
    }
  }
}

// === DEVELOPMENT UTILITIES ===
export const logFormState = <TFormValues extends FieldValues>(
  formValues: TFormValues,
  errors: any,
  isDirty: boolean,
  label = "Form State",
) => {
  if (process.env.NODE_ENV === "development") {
    console.group(`🔍 ${label}`)
    console.log("Values:", formValues)
    console.log("Errors:", errors)
    console.log("Is Dirty:", isDirty)
    console.log("Flattened Values:", flattenFormData(formValues))
    console.groupEnd()
  }
}

export const validateFormConfig = <TFormValues extends FieldValues>(
  config: FormConfig<TFormValues>,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Check for duplicate field names in fieldOrder
  if (config.fieldOrder) {
    const duplicates = config.fieldOrder.filter((item, index) => config.fieldOrder!.indexOf(item) !== index)
    if (duplicates.length > 0) {
      errors.push(`Duplicate fields in fieldOrder: ${duplicates.join(", ")}`)
    }

    // Check for fields in fieldOrder that don't exist in fields
    const missingFields = config.fieldOrder.filter((fieldName) => !(fieldName in config.fields))
    if (missingFields.length > 0) {
      errors.push(`Fields in fieldOrder not found in fields: ${missingFields.join(", ")}`)
    }
  }

  // Check for required fields without validation
  Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
    if (fieldConfig.label?.required && !fieldConfig.validation?.required) {
      errors.push(`Field "${fieldName}" is marked as required in label but missing required validation`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}
