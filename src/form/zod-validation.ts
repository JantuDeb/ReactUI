import { z, ZodTypeAny } from "zod"
import { AnyFieldConfig, FieldConfigMap, ValidationConfig } from "./types-v2"

function buildZodFromValidation(
  validation?: ValidationConfig<any>
): ZodTypeAny | undefined {
  if (!validation) return undefined

  let schema: ZodTypeAny = z.any()

  // Required
  if (validation.required) {
    const msg =
      typeof validation.required === "object"
        ? validation.required.message
        : "Required"
    schema = z.any().refine((val) => val != null && val !== "", {
      message: msg,
    })
  }

  // min/max numeric
  if (validation.min !== undefined) {
    const { value, message } =
      typeof validation.min === "object"
        ? validation.min
        : { value: validation.min, message: `>= ${validation.min}` }
    schema = z.number().min(value, { message })
  }
  if (validation.max !== undefined) {
    const { value, message } =
      typeof validation.max === "object"
        ? validation.max
        : { value: validation.max, message: `<= ${validation.max}` }
    schema = (schema as z.ZodNumber).max(value, { message })
  }

  // string length
  if (validation.minLength !== undefined) {
    const { value, message } =
      typeof validation.minLength === "object"
        ? validation.minLength
        : { value: validation.minLength, message: `Min length ${validation.minLength}` }
    schema = z.string().min(value, { message })
  }
  if (validation.maxLength !== undefined) {
    const { value, message } =
      typeof validation.maxLength === "object"
        ? validation.maxLength
        : { value: validation.maxLength, message: `Max length ${validation.maxLength}` }
    schema = (schema as z.ZodString).max(value, { message })
  }

  // regex pattern
  if (validation.pattern !== undefined) {
    const { value, message } =
      validation.pattern instanceof RegExp
        ? { value: validation.pattern, message: "Invalid format" }
        : validation.pattern
    schema = (schema as z.ZodString).regex(value, { message })
  }

  // validate callback (cross-field aware later)
  // if (validation.validate) {
  //   schema = schema.superRefine((val, ctx) => {
  //     const formValues = ctx.parent as Record<string, any>
  //     const res = validation.validate!(val, formValues)
  //     if (res === false || typeof res === "string") {
  //       ctx.addIssue({
  //         code: z.ZodIssueCode.custom,
  //         message: typeof res === "string" ? res : "Invalid value",
  //       })
  //     }
  //   })
  // }

  return schema
}



export function buildSchemaFromConfig(fields: FieldConfigMap<any>): z.ZodObject<any> {
  const shape: Record<string, ZodTypeAny> = {}

  for (const [key, field] of Object.entries(fields)) {
    const schema = buildZodFromValidation(field.validation)

    if (field.type === "group") {
      shape[key] = buildSchemaFromConfig(field.fields)
    } else if (field.type === "array") {
      const itemSchema = buildSchemaFromConfig(field.itemConfig)
      shape[key] = z.array(itemSchema)
    } else {
      shape[key] = schema ?? z.any() // fallback
    }
  }

  return z.object(shape)
}
