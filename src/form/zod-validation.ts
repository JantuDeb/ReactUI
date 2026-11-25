import z from "zod/v4"
import { FormConfig, SliderFieldConfig, GroupFieldConfig } from "./types"
import { FieldValues } from "react-hook-form"

// --- helper: assign schema to nested path ---
function assignNestedSchema(target: Record<string, z.ZodTypeAny>, path: string[], schema: z.ZodTypeAny) {
  const [head, ...rest] = path

  // Leaf
  if (rest.length === 0) {
    target[head] = schema
    return
  }

  const existing = target[head]

  if (existing instanceof z.ZodObject) {
    const def = existing.def
    const innerShape = typeof def.shape === "function" ? def.shape() : def.shape
    assignNestedSchema(innerShape, rest, schema)
    target[head] = z.object(innerShape)
    return
  }

  // Create new nested object
  const nestedShape: Record<string, z.ZodTypeAny> = {}
  assignNestedSchema(nestedShape, rest, schema)
  target[head] = z.object(nestedShape)
}

// --- Zod Schema Generation ---
export const generateZodSchema = <TFieldValues extends FieldValues>(
  fields: FormConfig<TFieldValues>["fields"],
): z.ZodObject<Record<string, z.ZodTypeAny>> => {
  const schemaFields: Record<string, z.ZodTypeAny> = {}

  Object.entries(fields).forEach(([fieldKey, fieldConfig]) => {
    if (!fieldConfig) return

    let fieldSchema: z.ZodTypeAny = z.any()

    // Base schema based on field type
    switch (fieldConfig.type) {
      case "input":
        if (fieldConfig.inputType === "email") {
          fieldSchema = z.string().email("Invalid email format")
        } else if (fieldConfig.inputType === "number") {
          fieldSchema = z.coerce.number()
        } else {
          fieldSchema = z.string()
        }
        break

      case "file_input": {
        const fileItemSchema = z.object({
          id: z.string().optional(),
          url: z.string(),
          name: z.string().optional(),
          size: z.number().optional(),
          type: z.string().optional(),
        })

        const fileSchema = z.instanceof(File)
        fieldSchema = z.array(z.union([fileSchema, fileItemSchema]))

        if (fieldConfig.maxFiles) fieldSchema = (fieldSchema as z.ZodArray<any>).max(fieldConfig.maxFiles)

        if (fieldConfig.minFiles) fieldSchema = (fieldSchema as z.ZodArray<any>).min(fieldConfig.minFiles)

        break
      }

      case "textarea":
      case "select":
      case "radio":
        fieldSchema = z.string()
        break

      case "multiselect":
        fieldSchema = z.array(z.string())
        break

      case "checkbox":
      case "switch":
        fieldSchema = z.boolean()
        break
      case "slider":
        const sliderConfig = fieldConfig as SliderFieldConfig<TFieldValues>
        fieldSchema = z.number()
        if (sliderConfig.min !== undefined && fieldSchema instanceof z.ZodNumber)
          fieldSchema = fieldSchema.min(sliderConfig.min)
        if (sliderConfig.max !== undefined && fieldSchema instanceof z.ZodNumber)
          fieldSchema = fieldSchema.max(sliderConfig.max)
        break
      case "color_picker":
        fieldSchema = z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format")
        break
      case "date_picker":
      case "time_picker":
        fieldSchema = z.union([z.string(), z.date()])
        break
      case "group": {
        const groupConfig = fieldConfig as GroupFieldConfig<TFieldValues>
        fieldSchema = generateZodSchema(groupConfig.fields)
        break
      }

      case "array": {
        const itemSchema = generateZodSchema(fieldConfig.itemConfig)
        fieldSchema = z.array(itemSchema)

        if (fieldConfig.minItems) fieldSchema = (fieldSchema as z.ZodArray<any>).min(fieldConfig.minItems)

        if (fieldConfig.maxItems) fieldSchema = (fieldSchema as z.ZodArray<any>).max(fieldConfig.maxItems)

        break
      }
      case "info":
        return
    }

    // Apply validation rules (UNCHANGED)
    if (fieldConfig.validation) {
      const validation = fieldConfig.validation

      if (validation.required) {
        const message =
          typeof validation.required === "boolean" ? "This field is required" : validation.required.message

        if (fieldSchema instanceof z.ZodString || fieldSchema instanceof z.ZodArray) {
          fieldSchema = fieldSchema.min(1, message)
        } else if (fieldSchema instanceof z.ZodNumber) {
          fieldSchema = fieldSchema.refine((val) => val != null, { message })
        } else if (fieldSchema instanceof z.ZodBoolean) {
          fieldSchema = fieldSchema.refine((val) => val === true, { message })
        }
      }

      if (validation.min && fieldSchema instanceof z.ZodNumber) {
        const rule = typeof validation.min === "number" ? validation.min : validation.min.value
        const message = typeof validation.min === "number" ? `Minimum value is ${rule}` : validation.min.message
        fieldSchema = fieldSchema.min(rule, message)
      }

      if (validation.max && fieldSchema instanceof z.ZodNumber) {
        const rule = typeof validation.max === "number" ? validation.max : validation.max.value
        const message = typeof validation.max === "number" ? `Maximum value is ${rule}` : validation.max.message
        fieldSchema = fieldSchema.max(rule, message)
      }

      if (validation.minLength && fieldSchema instanceof z.ZodString) {
        const rule = typeof validation.minLength === "number" ? validation.minLength : validation.minLength.value
        const message =
          typeof validation.minLength === "number" ? `Minimum length is ${rule}` : validation.minLength.message
        fieldSchema = fieldSchema.min(rule, message)
      }

      if (validation.maxLength && fieldSchema instanceof z.ZodString) {
        const rule = typeof validation.maxLength === "number" ? validation.maxLength : validation.maxLength.value
        const message =
          typeof validation.maxLength === "number" ? `Maximum length is ${rule}` : validation.maxLength.message
        fieldSchema = fieldSchema.max(rule, message)
      }

      if (validation.pattern && fieldSchema instanceof z.ZodString) {
        const pattern = validation.pattern instanceof RegExp ? validation.pattern : validation.pattern.value
        const message = validation.pattern instanceof RegExp ? "Invalid format" : validation.pattern.message
        fieldSchema = fieldSchema.regex(pattern, message)
      }

      if (validation.validate) {
        fieldSchema = fieldSchema.refine(
          (value) => {
            const result = validation.validate!(value, {} as TFieldValues)
            return typeof result === "boolean" ? result : result === undefined
          },
          { message: "Custom validation failed" },
        )
      }
    }

    // Fields with conditions are always optional in the schema — required validation
    // is enforced at runtime only when the field is actually visible (via unregister on hide)
    if (!fieldConfig.validation?.required || fieldConfig.conditions) {
      fieldSchema = fieldSchema.optional()
    }

    // ✅ ONLY CHANGE: dot-path handling
    if (fieldKey.includes(".")) {
      assignNestedSchema(schemaFields, fieldKey.split("."), fieldSchema)
    } else {
      schemaFields[fieldKey] = fieldSchema
    }
  })

  return z.object(schemaFields)
}
