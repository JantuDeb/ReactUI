import React from "react"
import {
  FormProvider,
  useForm,
  Controller,
  useFieldArray,
  FieldValues,
  UseFormReturn,
  FieldPath,
  useFormContext,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "../lib/utils"

import {
  FormProps,
  AnyFieldConfig,
  GroupFieldConfig,
  ArrayFieldConfig,
  FormFieldPath,
  InputFieldConfig,
  TextareaFieldConfig,
  CheckboxFieldConfig,
  SelectFieldConfig,
  MultiselectFieldConfig,
  RadioFieldConfig,
  SwitchFieldConfig,
  SliderFieldConfig,
  ColorPickerFieldConfig,
  DatePickerFieldConfig,
  TimePickerFieldConfig,
  InfoFieldConfig,
  FormConfig,
  type FormLabel as TFormLabel,
} from "./types-v2"
import { Button } from "../buttons/button"
import { Input } from "../inputs/input"
import { Textarea } from "../inputs/textarea"
import SelectStyled from "../inputs/select"
import { Checkbox } from "../inputs/checkbox"
import { RadioGroupStyled } from "../inputs/radio-group"
import { Label } from "./label"
import { FileInput } from "../file-upload/file-input"
import { cva } from "class-variance-authority"
import { MarkdownInput } from "../inputs/markdown-input"
import { Plus, Trash2 } from "lucide-react"

// const Textarea = React.forwardRef<HTMLTextAreaElement, any>((props, ref) => (
//   <textarea ref={ref} {...props} className={cn("border p-2 rounded w-full", props.className)} />
// ))

// const Checkbox = React.forwardRef<HTMLInputElement, any>(({ checkboxLabel, ...props }, ref) => (
//   <div className="flex items-center space-x-2">
//     <input type="checkbox" ref={ref} {...props} id={props.name} className={cn("border", props.className)} />
//     {checkboxLabel && (
//       <label htmlFor={props.name} className="text-sm">
//         {checkboxLabel}
//       </label>
//     )}
//   </div>
// ))

const Switch = React.forwardRef<HTMLInputElement, any>(({ switchLabel, ...props }, ref) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      ref={ref}
      {...props}
      id={props.name}
      className={cn("toggle toggle-primary", props.className)}
    />
    {switchLabel && (
      <label htmlFor={props.name} className="text-sm">
        {switchLabel}
      </label>
    )}
  </div>
))

// const Select = React.forwardRef<HTMLSelectElement, any>(({ options = [], ...props }, ref) => (
//   <select ref={ref} {...props} className={cn("border p-2 rounded w-full", props.className)}>
//     {props.placeholder && <option value="">{props.placeholder}</option>}
//     {options.map((option: any) => (
//       <option key={option.value} value={option.value}>
//         {option.label}
//       </option>
//     ))}
//   </select>
// ))

// const RadioGroup = React.forwardRef<HTMLDivElement, any>(({ options = [], direction = "vertical", ...props }, ref) => (
//   <div ref={ref} className={cn("space-y-2", direction === "horizontal" && "flex space-x-4 space-y-0")}>
//     {options.map((option: any) => (
//       <div key={option.value} className="flex items-center space-x-2">
//         <input type="radio" id={`${props.name}-${option.value}`} value={option.value} {...props} className="border" />
//         <label htmlFor={`${props.name}-${option.value}`} className="text-sm">
//           {option.label}
//         </label>
//       </div>
//     ))}
//   </div>
// ))

const Slider = React.forwardRef<HTMLInputElement, any>(({ min = 0, max = 100, step = 1, ...props }, ref) => (
  <input type="range" ref={ref} min={min} max={max} step={step} {...props} className={cn("w-full", props.className)} />
))

const FormItemContext = React.createContext<{
  fieldClassName?: string
  labelClassName?: string
  inputClassName?: string
}>({})

// Position Variants
const positionVariants = cva("gap-4 flex", {
  variants: {
    position: {
      top: "flex-col",
      left: "items-center grid grid-cols-12",
      right: "items-center flex-row-reverse justify-end",
      bottom: "flex-col-reverse",
    },
  },
  defaultVariants: {
    position: "top",
  },
})

// Form UI Components
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { position: TFormLabel["position"] }
>(({ className, position, ...props }, ref) => {
  const { fieldClassName } = React.useContext(FormItemContext)
  return <div ref={ref} className={cn(positionVariants({ position }), fieldClassName, className)} {...props} />
})

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.HTMLAttributes<HTMLLabelElement> & {
    htmlFor: string
    required?: boolean
    title: string
    position?: "top" | "left" | "right" | "bottom"
  }
>(({ className, title, htmlFor, required, position, ...props }, ref) => {
  const { formState } = useFormContext()
  const error = formState.errors[htmlFor]
  const { labelClassName } = React.useContext(FormItemContext)

  return (
    <Label
      ref={ref}
      htmlFor={htmlFor}
      className={cn("gap-0", labelClassName, error && "text-destructive", className)}
      {...props}
    >
      {title}
      {required && <span className="text-destructive ml-1">*</span>}
    </Label>
  )
})

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { fieldName?: string }
>(({ className, children, fieldName, ...props }, ref) => {
  const { formState } = useFormContext()
  const error = fieldName ? formState.errors[fieldName] : formState.errors.root
  const body = error ? String((error as any).message) : children

  if (!body) return null

  return (
    <p ref={ref} className={cn("text-xs text-destructive", className)} {...props}>
      {body}
    </p>
  )
})

const InfoComponent = ({
  message,
  variant = "info",
  title,
}: {
  message?: React.ReactNode
  variant?: "info" | "warning" | "error" | "success"
  title?: string
}) => {
  const variantStyles = {
    info: "border-blue-300 bg-blue-50 text-blue-700",
    warning: "border-yellow-300 bg-yellow-50 text-yellow-700",
    error: "border-red-300 bg-red-50 text-red-700",
    success: "border-green-300 bg-green-50 text-green-700",
  }

  return (
    <div className={cn("p-3 rounded border", variantStyles[variant])}>
      {title && <h4 className="font-semibold mb-1">{title}</h4>}
      <div>{message}</div>
    </div>
  )
}

// --- Zod Schema Generation ---
const generateZodSchema = <TFieldValues extends FieldValues>(
  fields: FormConfig<TFieldValues>["fields"],
): z.ZodSchema<any> => {
  const schemaFields: Record<string, z.ZodTypeAny> = {}

  Object.entries(fields).forEach(([fieldKey, fieldConfig]) => {
    if (!fieldConfig) return

    let fieldSchema: z.ZodTypeAny = z.any()

    // Base schema based on field type
    switch (fieldConfig.type) {
      case "input":
        // const inputConfig = fieldConfig as InputFieldConfig<TFieldValues>
        if (fieldConfig.inputType === "email") {
          fieldSchema = z.string().email("Invalid email format")
        } else if (fieldConfig.inputType === "number") {
          fieldSchema = z.coerce.number()
        } else {
          fieldSchema = z.string()
        }
        break
      case "file_input":
        const fileItemSchema = z.object({
          id: z.string().optional(),
          url: z.string(),
          name: z.string()?.optional(),
          size: z.number().optional(),
          type: z.string().optional(),
        })

        const fileSchema = z.instanceof(File)
        fieldSchema = z.array(z.union([fileSchema, fileItemSchema]))
        if (fieldConfig.maxFiles && fieldSchema instanceof z.ZodArray) {
          fieldSchema = fieldSchema.max(fieldConfig.maxFiles)
        }
        if (fieldConfig.minFiles && fieldSchema instanceof z.ZodArray) {
          fieldSchema = fieldSchema.min(fieldConfig.minFiles)
        }
        break
      case "textarea":
        fieldSchema = z.string()
        break
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
        fieldSchema = z.union([z.string(), z.date()])
        break
      case "time_picker":
        fieldSchema = z.union([z.string(), z.date()])
        break
      case "group":
        const groupConfig = fieldConfig as GroupFieldConfig<TFieldValues, any>
        fieldSchema = generateZodSchema(groupConfig.fields)
        break
      case "array":
        const arrayConfig = fieldConfig as ArrayFieldConfig<TFieldValues, any>
        const itemSchema = generateZodSchema(arrayConfig.itemConfig)
        fieldSchema = z.array(itemSchema)
        if (arrayConfig.minItems && fieldSchema instanceof z.ZodArray)
          fieldSchema = fieldSchema.min(arrayConfig.minItems)
        if (arrayConfig.maxItems && fieldSchema instanceof z.ZodArray)
          fieldSchema = fieldSchema.max(arrayConfig.maxItems)
        break
      case "info":
        // Info fields don't contribute to schema
        return
    }

    // Apply validation rules
    if (fieldConfig.validation) {
      const validation = fieldConfig.validation

      if (validation.required) {
        const message =
          typeof validation.required === "boolean" ? "This field is required" : validation.required.message
        if (fieldSchema instanceof z.ZodString || fieldSchema instanceof z.ZodArray) {
          fieldSchema = fieldSchema.min(1, message)
        } else if (fieldSchema instanceof z.ZodNumber) {
          fieldSchema = fieldSchema.refine((val) => val !== undefined && val !== null, {
            message,
          })
        } else if (fieldSchema instanceof z.ZodBoolean) {
          fieldSchema = fieldSchema.refine((val) => val === true, {
            message,
          })
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

      if (validation.pattern) {
        const pattern = validation.pattern instanceof RegExp ? validation.pattern : validation.pattern.value
        const message = validation.pattern instanceof RegExp ? "Invalid format" : validation.pattern.message
        if (fieldSchema instanceof z.ZodString) {
          fieldSchema = fieldSchema.regex(pattern, message)
        }
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

    // Make optional if no required validation
    if (!fieldConfig.validation?.required) {
      fieldSchema = fieldSchema.optional()
    }

    schemaFields[fieldKey] = fieldSchema
  })

  return z.object(schemaFields)
}

const getFieldDefaultValue = <TFieldValues extends FieldValues>(fieldConfig: AnyFieldConfig<TFieldValues>): any => {
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

// --- Field Renderer ---
interface RenderFieldProps<TFieldValues extends FieldValues> {
  fieldKey: string
  fieldConfig: AnyFieldConfig<TFieldValues>
  pathPrefix?: string
}

const RenderField = <TFieldValues extends FieldValues>({
  fieldKey,
  fieldConfig,
  pathPrefix = "",
}: RenderFieldProps<TFieldValues>) => {
  const { control, formState, trigger, register } = useFormContext<TFieldValues>()
  const fullPath = (pathPrefix ? `${pathPrefix}.${fieldKey}` : fieldKey) as FormFieldPath<TFieldValues>
  const { inputClassName } = React.useContext(FormItemContext)

  if (fieldConfig.hidden) return null

  const labelConfig = fieldConfig.label
  const error = formState.errors[fullPath]
  const defaultValue = getFieldDefaultValue(fieldConfig)

  const renderLabel = () => {
    if (!labelConfig) return null
    return <FormLabel htmlFor={fullPath} {...labelConfig} />
  }

  const renderAction = () => {
    if (!fieldConfig.action) return null
    return (
      <Button
        type="button"
        variant={fieldConfig.action.variant || "outline"}
        size={fieldConfig.action.size || "sm"}
        onClick={async () => {
          if (fieldConfig.action?.validateOnClick) {
            await trigger(fullPath)
          }
          fieldConfig.action?.onClick({} as UseFormReturn<TFieldValues>, fullPath)
        }}
      >
        {fieldConfig.action.label}
      </Button>
    )
  }

  const renderFieldInput = () => {
    const commonProps = {
      disabled: fieldConfig.disabled || formState.isSubmitting,
      className: cn(inputClassName, error && "border-red-500"),
      placeholder: fieldConfig.placeholder,
      defaultValue,
    }

    switch (fieldConfig.type) {
      case "input": {
        const { type, label, validation, inputType, ...fieldProps } = fieldConfig
        return (
          // <Controller
          //   name={fullPath}
          //   control={control}
          //   defaultValue={defaultValue as any}
          //   render={({ field }) => (
          <Input
            {...register(fullPath)}
            {...commonProps}
            {...fieldProps}
            id={fullPath}
            type={fieldConfig.inputType || "text"}
          />
          //   )}
          // />
        )
      }

      case "textarea": {
        const { type, label, validation, resize, ...fieldProps } = fieldConfig
        return (
          <Textarea {...register(fullPath, {})} {...commonProps} id={fullPath} {...fieldConfig} style={{ resize }} />
        )
      }

      case "select": {
        const { type, label, validation, ...fieldProps } = fieldConfig
        return (
          <Controller
            name={fullPath}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
              <SelectStyled
                {...field}
                {...commonProps}
                {...fieldProps}
                name={fullPath}
                onValueChange={(value) => {
                  field.onChange(value)
                }}
              />
            )}
          />
        )
      }

      case "file_input": {
        const { type, label, validation, ...fieldProps } = fieldConfig
        return (
          <Controller
            name={fullPath}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
              <FileInput
                name={fullPath}
                onBlur={field.onBlur}
                ref={field.ref}
                {...commonProps}
                disabled={field.disabled}
                view="grid"
                {...fieldProps}
                onValueChange={(files) => field.onChange(files)}
                defaultValue={formState.defaultValues?.[fullPath]}
                value={field.value}
              />
            )}
          />
        )
      }

      case "markdown_input": {
        const { type, label, validation, ...fieldProps } = fieldConfig
        return (
          <Controller
            name={fullPath}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => <MarkdownInput {...field} id={fullPath} {...commonProps} {...fieldProps} />}
          />
        )
      }

      case "multiselect":
        const multiselectConfig = fieldConfig as MultiselectFieldConfig<TFieldValues>
        return (
          <Controller
            name={fullPath}
            control={control}
            defaultValue={defaultValue as any}
            render={({ field }) => (
              <select {...field} {...commonProps} id={fullPath} multiple value={field.value || []}>
                {multiselectConfig.options.map((option: any) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
        )

      case "checkbox":
        return (
          <Controller
            name={fullPath}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
              <Checkbox
                {...commonProps}
                {...fieldConfig}
                value={fullPath}
                id={fullPath}
                onCheckedChange={field.onChange}
                checked={field.value}
                name={field.name}
                type="button"
              />
            )}
          />
        )

      case "switch":
        const switchConfig = fieldConfig as SwitchFieldConfig<TFieldValues>
        return (
          <Controller
            name={fullPath}
            control={control}
            defaultValue={defaultValue as any}
            render={({ field }) => (
              <Switch
                {...field}
                {...commonProps}
                id={fullPath}
                checked={field.value}
                switchLabel={switchConfig.switchLabel}
              />
            )}
          />
        )

      case "radio":
        const radioConfig = fieldConfig as RadioFieldConfig<TFieldValues>
        return (
          <Controller
            name={fullPath}
            control={control}
            defaultValue={defaultValue as any}
            render={({ field }) => (
              <RadioGroupStyled
                {...field}
                {...commonProps}
                name={fullPath}
                {...radioConfig}
                onValueChange={(value) => field.onChange(value)}
              />
            )}
          />
        )

      case "slider":
        const sliderConfig = fieldConfig as SliderFieldConfig<TFieldValues>
        return (
          <Controller
            name={fullPath}
            control={control}
            defaultValue={defaultValue as any}
            render={({ field }) => (
              <Slider
                {...field}
                {...commonProps}
                id={fullPath}
                min={sliderConfig.min}
                max={sliderConfig.max}
                step={sliderConfig.step}
              />
            )}
          />
        )

      case "color_picker":
        return (
          <Controller
            name={fullPath}
            control={control}
            defaultValue={defaultValue as any}
            render={({ field }) => (
              <input
                {...field}
                {...commonProps}
                id={fullPath}
                type="color"
                className={cn("w-full h-10", commonProps.className)}
              />
            )}
          />
        )

      // case "datePicker":
      //   return (
      //     <Controller
      //       name={fullPath}
      //       control={control}
      //       defaultValue={defaultValue as any}
      //       render={({ field }) => (
      //         <input
      //           {...field}
      //           {...commonProps}
      //           id={fullPath}
      //           type="date"
      //           value={field.value instanceof Date ? field.value.toISOString().split("T")[0] : field.value}
      //         />
      //       )}
      //     />
      //   )

      case "time_picker":
        return (
          <Controller
            name={fullPath}
            control={control}
            defaultValue={defaultValue as any}
            render={({ field }) => <input {...field} {...commonProps} id={fullPath} type="time" />}
          />
        )

      case "group":
        const groupConfig = fieldConfig as GroupFieldConfig<TFieldValues, any>
        return (
          <div className={cn("p-4 border rounded", groupConfig.layout === "horizontal" && "flex space-x-4")}>
            {Object.entries(groupConfig.fields).map(([subFieldKey, subFieldConfig]) => (
              <RenderField
                key={subFieldKey}
                fieldKey={subFieldKey}
                fieldConfig={subFieldConfig as AnyFieldConfig<TFieldValues>}
                pathPrefix={fullPath}
              />
            ))}
          </div>
        )

      case "array":
        const arrayConfig = fieldConfig as ArrayFieldConfig<TFieldValues, any>
        const {
          fields: fieldArrayItems,
          append,
          remove,
        } = useFieldArray({
          control,
          name: fullPath as any,
        })

        return (
          <div className="w-full">
            {fieldArrayItems.map((item, index) => (
              <div key={item.id} className="p-2 border rounded relative space-y-4 group/option">
                {Object.entries(arrayConfig.itemConfig).map(([subFieldKey, subFieldConfig]) => (
                  <RenderField
                    key={subFieldKey}
                    fieldKey={subFieldKey}
                    fieldConfig={subFieldConfig as AnyFieldConfig<TFieldValues>}
                    pathPrefix={`${fullPath}.${index}`}
                  />
                ))}

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 group-hover/option:visible invisible"
                  onClick={() => remove(index)}
                  disabled={
                    formState.isSubmitting ||
                    (arrayConfig.minItems !== undefined && fieldArrayItems.length <= arrayConfig.minItems)
                  }
                >
                  <Trash2 />
                </Button>
              </div>
            ))}

            <div className="flex items-center gap-4 justify-center py-2">
              <Button
                type="button"
                className="w-full"
                variant="outline"
                onClick={() => append({} as any)}
                disabled={
                  formState.isSubmitting ||
                  (arrayConfig.maxItems !== undefined && fieldArrayItems.length >= arrayConfig.maxItems)
                }
              >
                <Plus /> {arrayConfig.addLabel || "Add Item"}
              </Button>
            </div>
          </div>
        )

      case "info":
        const infoConfig = fieldConfig as InfoFieldConfig<TFieldValues>
        return <InfoComponent message={infoConfig.message} variant={infoConfig.variant} title={infoConfig.title} />

      default:
        return <div className="text-destructive">Unsupported field type: {(fieldConfig as any).type}</div>
    }
  }

  const { position = "top" } = labelConfig || {}

  return (
    <FormItem className={fieldConfig.className} position={position}>
      <div className={cn("flex justify-between items-center", position === "left" && "col-span-2")}>
        {/* position !== "bottom" && position !== "right" && */ renderLabel()}
        {fieldConfig.action?.placement === "label_end" && renderAction()}
      </div>
      <div className={cn("flex items-center space-x-2", position === "left" && "col-span-10")}>
        {renderFieldInput()}
        {fieldConfig.action?.placement === "field_end" && renderAction()}
      </div>
      <FormMessage fieldName={fullPath} />
      {fieldConfig.description && (
        <p
          className={cn(
            "text-sm text-muted-foreground mt-1",
            position === "left" ? "col-start-3 col-end-12" : "col-span-12",
          )}
        >
          {fieldConfig.description}
        </p>
      )}
    </FormItem>
  )
}

// --- Main Form Component ---
export const Form = <TFieldValues extends FieldValues = Record<string, any>>({
  config,
  methods: providedMethods,
  defaultValues,
  onSubmit,
  onChange,
  onError,
  onSuccess,
  className,
  fieldClassName,
  labelClassName,
  inputClassName,
  submitButton,
}: FormProps<TFieldValues>) => {
  // Generate Zod schema from config
  const zodSchema = React.useMemo(() => generateZodSchema(config.fields), [config.fields])

  // Create form methods with Zod resolver
  const internalMethods = useForm<TFieldValues>({
    resolver: zodResolver(zodSchema),
    defaultValues,
    mode: config.mode || "onChange",
    reValidateMode: config.reValidateMode || "onChange",
    shouldFocusError: config.shouldFocusError ?? true,
  })

  const methods = providedMethods || internalMethods
  const { handleSubmit, formState, watch, reset } = methods

  // Watch for changes
  React.useEffect(() => {
    if (!onChange) return
    const subscription = watch((values, { name, type }) => {
      if (type === "change") {
        onChange(values as Partial<TFieldValues>, name as FormFieldPath<TFieldValues>)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, onChange])

  const handleFormSubmit = async (data: TFieldValues) => {
    try {
      const response = await onSubmit?.(data)
      onSuccess?.(response)
      reset()
    } catch (error: any) {
      onError?.(error)
    }
  }

  const fieldOrder = config.fieldOrder || Object.keys(config.fields)

  return (
    <FormProvider {...methods}>
      <FormItemContext.Provider value={{ fieldClassName, labelClassName, inputClassName }}>
        <form
          onSubmit={onSubmit ? handleSubmit(handleFormSubmit) : (e) => e.preventDefault()}
          className={cn("space-y-6", className)}
        >
          {config.title && <h2 className="text-xl font-semibold">{config.title}</h2>}
          {config.description && <p className="text-sm text-gray-600 mb-4">{config.description}</p>}

          <div
            className={cn(
              "space-y-6",
              config.layout === "horizontal" && "flex space-x-4 space-y-0",
              config.layout === "grid" && "grid grid-cols-2 gap-4",
            )}
          >
            {fieldOrder.map((fieldKey) => {
              const fieldConfig = config.fields[fieldKey as string]
              if (!fieldConfig) {
                console.warn(`Form: No configuration found for field "${String(fieldKey)}"`)
                return null
              }
              return (
                <RenderField<TFieldValues>
                  key={String(fieldKey)}
                  fieldKey={String(fieldKey)}
                  fieldConfig={fieldConfig}
                />
              )
            })}
          </div>

          <FormMessage />

          {/* Only show submit button if submitButton !== false and onSubmit is provided */}
          {submitButton !== false && onSubmit && (
            <Button
              type="submit"
              className={cn("w-full", submitButton?.className)}
              disabled={submitButton?.disabled || formState.isSubmitting}
            >
              {formState.isSubmitting ? "Submitting..." : submitButton?.text || "Submit"}
            </Button>
          )}
        </form>
      </FormItemContext.Provider>
    </FormProvider>
  )
}
