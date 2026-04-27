import React from "react"
import {
  FormProvider,
  useForm,
  Controller,
  useFieldArray,
  FieldValues,
  UseFormReturn,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "../lib/utils"

import {
  FormProps,
  AnyFieldConfig,
  GroupFieldConfig,
  ArrayFieldConfig,
  FormFieldPath,
  SliderFieldConfig,
  InfoFieldConfig,
  type FormLabel as TFormLabel,
  TiptapEditorFieldConfig,
} from "./types"
import { Button } from "../buttons/button"
import { Input } from "../inputs/input"
import { Textarea } from "../inputs/textarea"
import SelectStyled from "../inputs/select"
import { Checkbox } from "../inputs/checkbox"
import { RadioGroupStyled } from "../inputs/radio-group"
import { Label } from "./label"
import { FileInput } from "../file-upload/file-input"
import { cva } from "class-variance-authority"
import MarkdownInput from "../inputs/markdown-input"
const TiptapEditor = React.lazy(() =>
  import("tiptap-editor-library").then((mod) => ({ default: mod.Editor })),
)
import "tiptap-editor-library/dist/tiptap-editor-library.css"
import { Plus, Trash2 } from "lucide-react"
import { evaluateCondition, getFieldDefaultValue, unflattenObject } from "./utils"
import { MultiSelect } from "../inputs/multi-select"
import { DatePicker } from "../inputs/date-picker"
import { generateZodSchema } from "./zod-validation"
import { GroupField } from "./group-field"

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
  const { control, formState, trigger, register, unregister } = useFormContext<TFieldValues>()
  const fullPath = (pathPrefix ? `${pathPrefix}.${fieldKey}` : fieldKey) as FormFieldPath<TFieldValues>
  const { inputClassName } = React.useContext(FormItemContext)

  const allValues = useWatch({ control })
  const isVisible = fieldConfig.conditions ? evaluateCondition(fieldConfig.conditions, allValues as Record<string, any>) : true

  React.useEffect(() => {
    if (!isVisible && fieldConfig.conditions) {
      unregister(fullPath)
    }
  }, [isVisible])

  if (fieldConfig.hidden || !isVisible) return null

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
        const { type, label, validation, ...fieldProps } = fieldConfig
        return (
          <Controller
            name={fullPath}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
              <MultiSelect
                modal={true}
                {...field}
                {...commonProps}
                {...fieldProps}
                defaultValue={defaultValue}
                onValueChange={(value) => field.onChange(value)}
                popoverClassName="w-[var(--radix-popover-trigger-width)]"
              />
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
        const switchConfig = fieldConfig as any
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
        const radioConfig = fieldConfig as any
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

      case "date_picker": {
        const { type, label, validation, ...fieldProps } = fieldConfig
        return (
          <Controller
            name={fullPath}
            control={control}
            defaultValue={defaultValue as any}
            render={({ field }) => {
              const dateValue = field.value ? new Date(field.value) : undefined
              const timeString =
                dateValue && !isNaN(dateValue.getTime())
                  ? `${dateValue.getHours().toString().padStart(2, "0")}:${dateValue.getMinutes().toString().padStart(2, "0")}`
                  : undefined
              return (
                <DatePicker
                  {...fieldProps}
                  {...field}
                  mode="single"
                  modal
                  selected={dateValue}
                  onSelect={(date: Date | undefined) => {
                    field.onChange(date)
                  }}
                  showTimeInput
                  onTimeChange={(time) => {
                    const [hours, minutes] = time.split(":").map(Number)
                    const currentDate = field.value ? new Date(field.value) : new Date()
                    if (!isNaN(hours) && !isNaN(minutes)) {
                      currentDate.setHours(hours, minutes)
                      field.onChange(new Date(currentDate))
                    }
                  }}
                  timeValue={timeString}
                />
              )
            }}
          />
        )
      }

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
          <GroupField
            fieldKey={fieldKey}
            fieldConfig={groupConfig}
            pathPrefix={pathPrefix}
            renderField={RenderField}
          />
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
                {arrayConfig.itemLayouts
                  ? (() => {
                      const layoutKeys = arrayConfig.itemLayouts.flat()
                      const remainingKeys = Object.keys(arrayConfig.itemConfig).filter((k) => !layoutKeys.includes(k))
                      return (
                        <>
                          {arrayConfig.itemLayouts.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex flex-row gap-3 w-full">
                              {row.map((subFieldKey) => (
                                <div key={subFieldKey} className="flex-1 min-w-0">
                                  <RenderField
                                    fieldKey={subFieldKey}
                                    fieldConfig={arrayConfig.itemConfig[subFieldKey] as AnyFieldConfig<TFieldValues>}
                                    pathPrefix={`${fullPath}.${index}`}
                                  />
                                </div>
                              ))}
                            </div>
                          ))}
                          {remainingKeys.map((subFieldKey) => (
                            <RenderField
                              key={subFieldKey}
                              fieldKey={subFieldKey}
                              fieldConfig={arrayConfig.itemConfig[subFieldKey] as AnyFieldConfig<TFieldValues>}
                              pathPrefix={`${fullPath}.${index}`}
                            />
                          ))}
                        </>
                      )
                    })()
                  : Object.entries(arrayConfig.itemConfig).map(([subFieldKey, subFieldConfig]) => (
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

      case "tiptap_editor": {
        const { type, label, validation, defaultValue: _dv, value: _v, disabled: _disabled, hidden: _hidden, className: _cls, description: _desc, shouldUnregister: _su, deps: _deps, action: _action, ...editorProps } =
          fieldConfig as TiptapEditorFieldConfig<TFieldValues>
        return (
          <Controller
            name={fullPath}
            control={control}
            defaultValue={defaultValue}
            render={({ field }) => (
              <React.Suspense fallback={<div className="h-32 animate-pulse rounded-md bg-muted" />}>
                <TiptapEditor
                  {...editorProps}
                  initialValue={(field.value as any)?.markdown ?? (field.value as any)?.json ?? (field.value as any)?.html ?? ""}
                  contentType={editorProps.contentType ?? "markdown"}
                  onChange={(content) => field.onChange(content)}
                />
              </React.Suspense>
            )}
          />
        )
      }

      case "info":
        const infoConfig = fieldConfig as InfoFieldConfig<TFieldValues>
        return <InfoComponent message={infoConfig.message} variant={infoConfig.variant} title={infoConfig.title} />

      default:
        return <div className="text-destructive">Unsupported field type: {(fieldConfig as any).type}</div>
    }
  }

  const { position = "top" } = labelConfig || {}

  if (position === "right") {
    return (
      <div className={cn("flex gap-3", fieldConfig.className)}>
        <div className="flex items-center">
          {renderFieldInput()}
          {fieldConfig.action?.placement === "field_end" && renderAction()}
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex justify-between items-center">
            {renderLabel()}
            {fieldConfig.action?.placement === "label_end" && renderAction()}
          </div>
          {fieldConfig.description && (
            <p className="text-sm text-muted-foreground mt-1">{fieldConfig.description}</p>
          )}
          <FormMessage fieldName={fullPath} />
        </div>
      </div>
    )
  }

  return (
    <FormItem className={fieldConfig.className} position={position}>
      <div className={cn("flex justify-between items-center", position === "left" && "col-span-2")}>
        {renderLabel()}
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
  afterSubmit = "keep",
}: FormProps<TFieldValues>) => {
  // Generate Zod schema from config
  const zodSchema = React.useMemo(() => generateZodSchema(config.fields), [config.fields])

  // Create form methods with Zod resolver
  const internalMethods = useForm<TFieldValues>({
    resolver: zodResolver(zodSchema as any),
    defaultValues,
    // defaultValues: config.flattenFormValues && defaultValues ? unflattenObject(defaultValues) : defaultValues,
    mode: config.mode || "onChange",
    reValidateMode: config.reValidateMode || "onChange",
    shouldFocusError: config.shouldFocusError ?? true,
  })

  const methods = providedMethods || internalMethods
  const { handleSubmit, formState, watch, reset, setError } = methods

  // Watch for changes
  React.useEffect(() => {
    if (!onChange) return
    const subscription = watch((values, { name, type }) => {
      if (type === "change") {
        const processedValues = config.unflattenFormValues ? unflattenObject(values as Record<string, any>) : values
        onChange(processedValues as Partial<TFieldValues>, name as FormFieldPath<TFieldValues>)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, onChange])

  const handleFormSubmit = async (data: TFieldValues) => {
    try {
      const processedData = config.unflattenFormValues ? unflattenObject(data) : data
      const response = await onSubmit?.(processedData as TFieldValues)
      onSuccess?.(response)
      if (afterSubmit === "reset") reset(defaultValues)
      else if (afterSubmit === "clear") reset()
    } catch (error: any) {
      const message = error?.message || "Something went wrong"
      setError("root", { message })
      onError?.(error)
    }
  }

  const fieldOrder = config.fieldOrder || Object.keys(config.fields)

  return (
    <FormProvider {...methods}>
      <FormItemContext.Provider value={{ fieldClassName, labelClassName, inputClassName }}>
        <form
          onSubmit={onSubmit ? handleSubmit(handleFormSubmit) : (e) => e.preventDefault()}
          className={cn("space-y-6 px-2", className)}
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
            {config.layouts
              ? config.layouts.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex flex-row gap-4 w-full">
                    {row.map((fieldKey) => {
                      const fieldConfig = config.fields[fieldKey]
                      if (!fieldConfig) {
                        console.warn(`Form: No configuration found for field "${fieldKey}"`)
                        return null
                      }
                      return (
                        <div key={fieldKey} className="flex-1 min-w-0">
                          <RenderField<TFieldValues>
                            fieldKey={fieldKey}
                            fieldConfig={fieldConfig}
                          />
                        </div>
                      )
                    })}
                  </div>
                ))
              : fieldOrder.map((fieldKey) => {
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
