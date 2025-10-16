// import React, { memo, useCallback, useMemo, useContext, createContext } from "react"
// import {
//   FormProvider,
//   useForm,
//   Controller,
//   useFieldArray,
//   useFormContext,
//   useWatch,
//   FieldValues,
//   UseFormReturn,
//   Control,
//   get,
// } from "react-hook-form"
// import { cn } from "../lib/utils"
import { Form } from "./index"

import { FormConfig } from "./types-v2"

// import {
//   FormProps,
//   AnyFieldConfig,
//   FieldRendererProps,
//   FormContextValue,
//   FormFieldPath,
//   FormConfig,
//   FieldConfigMap,
//   createValidationRules,
//   isInputField,
//   isTextareaField,
//   isSelectField,
//   isMultiselectField,
//   isCheckboxField,
//   isRadioField,
//   isSwitchField,
//   isSliderField,
//   isColorPickerField,
//   isDatePickerField,
//   isTimePickerField,
//   isGroupField,
//   isArrayField,
//   isInfoField,
//   InputFieldConfig,
//   TextareaFieldConfig,
//   SelectFieldConfig,
//   MultiselectFieldConfig,
//   CheckboxFieldConfig,
//   RadioFieldConfig,
//   GroupFieldConfig,
//   ArrayFieldConfig,
// } from "./types-v2"
// import { Button } from "../buttons/button"

// // === FORM CONTEXT ===
// const FormContext = createContext<FormContextValue | null>(null)

// const useFormConfig = <TFormValues extends FieldValues = FieldValues>() => {
//   const context = useContext(FormContext) as FormContextValue<TFormValues> | null
//   if (!context) {
//     throw new Error("useFormConfig must be used within a Form component")
//   }
//   return context
// }

// // === UI COMPONENTS (Replace with your actual components) ===
// const Input = memo(
//   React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
//     <input
//       ref={ref}
//       {...props}
//       className={cn(
//         "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//         props.className,
//       )}
//     />
//   )),
// )

// const Textarea = memo(
//   React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => (
//     <textarea
//       ref={ref}
//       {...props}
//       className={cn(
//         "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//         props.className,
//       )}
//     />
//   )),
// )

// const Checkbox = memo(
//   React.forwardRef<
//     HTMLInputElement,
//     React.InputHTMLAttributes<HTMLInputElement> & {
//       checkboxLabel?: string
//     }
//   >(({ checkboxLabel, ...props }, ref) => (
//     <div className="flex items-center space-x-2">
//       <input
//         type="checkbox"
//         ref={ref}
//         {...props}
//         className={cn(
//           "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//           props.className,
//         )}
//       />
//       {checkboxLabel && (
//         <label
//           htmlFor={props.id}
//           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//         >
//           {checkboxLabel}
//         </label>
//       )}
//     </div>
//   )),
// )

// const Select = memo(React.lazy(() => import("../inputs/select")))

// // === FORM UI COMPONENTS ===
// const FormItem = memo(
//   React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { error?: boolean }>(
//     ({ className, error, ...props }, ref) => (
//       <div ref={ref} className={cn("space-y-2", error && "text-destructive", className)} {...props} />
//     ),
//   ),
// )

// const FormLabel = memo(
//   React.forwardRef<
//     HTMLLabelElement,
//     React.LabelHTMLAttributes<HTMLLabelElement> & {
//       required?: boolean
//       text: string
//     }
//   >(({ className, text, required, ...props }, ref) => (
//     <label
//       ref={ref}
//       className={cn(
//         "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
//         className,
//       )}
//       {...props}
//     >
//       {text}
//       {required && <span className="text-destructive ml-1">*</span>}
//     </label>
//   )),
// )

// const FormDescription = memo(({ children, className }: { children: React.ReactNode; className?: string }) => (
//   <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
// ))

// const FormMessage = memo(({ message, className }: { message?: string; className?: string }) => {
//   if (!message) return null
//   return <p className={cn("text-sm font-medium text-destructive", className)}>{message}</p>
// })

// const InfoAlert = memo(
//   ({
//     variant = "info",
//     title,
//     message,
//     className,
//   }: {
//     variant?: "info" | "warning" | "error" | "success"
//     title?: string
//     message?: React.ReactNode
//     className?: string
//   }) => {
//     const variantStyles = {
//       info: "border-blue-200 bg-blue-50 text-blue-900",
//       warning: "border-amber-200 bg-amber-50 text-amber-900",
//       error: "border-red-200 bg-red-50 text-red-900",
//       success: "border-green-200 bg-green-50 text-green-900",
//     }

//     return (
//       <div className={cn("border rounded-md p-4", variantStyles[variant], className)}>
//         {title && <h4 className="font-semibold mb-1">{title}</h4>}
//         {message && <div>{message}</div>}
//       </div>
//     )
//   },
// )

// // === FIELD RENDERERS ===
// const InputRenderer = memo(
//   <TFormValues extends FieldValues>({
//     name,
//     config,
//     control,
//     disabled,
//     className,
//   }: FieldRendererProps<TFormValues> & { config: InputFieldConfig<TFormValues> }) => {
//     const { methods } = useFormConfig<TFormValues>()
//     const { getValues } = methods

//     const validationRules = useMemo(
//       () => createValidationRules(config.validation, getValues),
//       [config.validation, getValues],
//     )

//     return (
//       <Controller
//         name={name}
//         control={control}
//         rules={validationRules}
//         defaultValue={config.defaultValue}
//         shouldUnregister={config.shouldUnregister}
//         render={({ field, fieldState }) => (
//           <FormItem error={!!fieldState.error} className={className}>
//             {config.label && (
//               <FormLabel
//                 htmlFor={field.name}
//                 text={config.label.text}
//                 required={config.label.required}
//                 className={config.label.className}
//               />
//             )}
//             <div className="relative">
//               {config.prefix && (
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
//                   {config.prefix}
//                 </span>
//               )}
//               <Input
//                 {...field}
//                 id={field.name}
//                 type={config.inputType || "text"}
//                 placeholder={config.placeholder}
//                 disabled={disabled || config.disabled}
//                 maxLength={config.maxLength}
//                 className={cn(config.prefix && "pl-8", config.suffix && "pr-8", config.className)}
//               />
//               {config.suffix && (
//                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
//                   {config.suffix}
//                 </span>
//               )}
//             </div>
//             {config.description && <FormDescription className={config.className}>{config.description}</FormDescription>}
//             <FormMessage message={fieldState.error?.message} />
//             {config.action && (
//               <Button
//                 type="button"
//                 variant={config.action.variant || "outline"}
//                 size={config.action.size || "sm"}
//                 onClick={() => config.action!.onClick(methods, name)}
//                 className="mt-2"
//               >
//                 {config.action.label}
//               </Button>
//             )}
//           </FormItem>
//         )}
//       />
//     )
//   },
// )

// const TextareaRenderer = memo(
//   <TFormValues extends FieldValues>({
//     name,
//     config,
//     control,
//     disabled,
//     className,
//   }: FieldRendererProps<TFormValues> & { config: TextareaFieldConfig<TFormValues> }) => {
//     const { methods } = useFormConfig<TFormValues>()
//     const { getValues } = methods

//     const validationRules = useMemo(
//       () => createValidationRules(config.validation, getValues),
//       [config.validation, getValues],
//     )

//     return (
//       <Controller
//         name={name}
//         control={control}
//         rules={validationRules}
//         defaultValue={config.defaultValue}
//         shouldUnregister={config.shouldUnregister}
//         render={({ field, fieldState }) => (
//           <FormItem error={!!fieldState.error} className={className}>
//             {config.label && (
//               <FormLabel
//                 htmlFor={field.name}
//                 text={config.label.text}
//                 required={config.label.required}
//                 className={config.label.className}
//               />
//             )}
//             <Textarea
//               {...field}
//               id={field.name}
//               rows={config.rows}
//               cols={config.cols}
//               placeholder={config.placeholder}
//               disabled={disabled || config.disabled}
//               style={{ resize: config.resize || "vertical" }}
//               className={config.className}
//             />
//             {config.description && <FormDescription>{config.description}</FormDescription>}
//             <FormMessage message={fieldState.error?.message} />
//           </FormItem>
//         )}
//       />
//     )
//   },
// )

// const CheckboxRenderer = memo(
//   <TFormValues extends FieldValues>({
//     name,
//     config,
//     control,
//     disabled,
//     className,
//   }: FieldRendererProps<TFormValues> & { config: CheckboxFieldConfig<TFormValues> }) => {
//     const { methods } = useFormConfig<TFormValues>()
//     const { getValues } = methods

//     const validationRules = useMemo(
//       () => createValidationRules(config.validation, getValues),
//       [config.validation, getValues],
//     )

//     return (
//       <Controller
//         name={name}
//         control={control}
//         rules={validationRules}
//         defaultValue={config.defaultValue || false}
//         shouldUnregister={config.shouldUnregister}
//         render={({ field, fieldState }) => (
//           <FormItem error={!!fieldState.error} className={className}>
//             <div className="flex items-start space-x-3">
//               <Checkbox
//                 id={field.name}
//                 checked={field.value}
//                 onChange={field.onChange}
//                 onBlur={field.onBlur}
//                 disabled={disabled || config.disabled}
//                 checkboxLabel={config.checkboxLabel}
//                 className={config.className}
//               />
//               <div className="flex-1">
//                 {config.label && !config.checkboxLabel && (
//                   <FormLabel
//                     htmlFor={field.name}
//                     text={config.label.text}
//                     required={config.label.required}
//                     className={config.label.className}
//                   />
//                 )}
//                 {config.description && <FormDescription>{config.description}</FormDescription>}
//               </div>
//             </div>
//             <FormMessage message={fieldState.error?.message} />
//           </FormItem>
//         )}
//       />
//     )
//   },
// )

// const SelectRenderer = memo(
//   <TFormValues extends FieldValues>({
//     name,
//     config,
//     control,
//     disabled,
//     className,
//   }: FieldRendererProps<TFormValues> & { config: SelectFieldConfig<TFormValues> }) => {
//     const { methods } = useFormConfig<TFormValues>()
//     const { getValues } = methods

//     const validationRules = useMemo(
//       () => createValidationRules(config.validation, getValues),
//       [config.validation, getValues],
//     )

//     return (
//       <Controller
//         name={name}
//         control={control}
//         rules={validationRules}
//         defaultValue={config.defaultValue}
//         shouldUnregister={config.shouldUnregister}
//         render={({ field, fieldState }) => (
//           <FormItem error={!!fieldState.error} className={className}>
//             {config.label && (
//               <FormLabel
//                 htmlFor={field.name}
//                 text={config.label.text}
//                 required={config.label.required}
//                 className={config.label.className}
//               />
//             )}
//             <React.Suspense fallback={<div className="h-10 bg-muted animate-pulse rounded" />}>
//               <Select
//                 options={config.options}
//                 value={field.value}
//                 onSelect={field.onChange}
//                 placeholder={config.placeholder}
//                 disabled={disabled || config.disabled}
//                 // searchable={config.searchable}
//                 // clearable={config.clearable}
//                 className={config.className}
//               />
//             </React.Suspense>
//             {config.description && <FormDescription>{config.description}</FormDescription>}
//             <FormMessage message={fieldState.error?.message} />
//           </FormItem>
//         )}
//       />
//     )
//   },
// )

// const GroupRenderer = memo(
//   <TFormValues extends FieldValues>({
//     name,
//     config,
//     control,
//     disabled,
//     className,
//     pathPrefix = "",
//   }: FieldRendererProps<TFormValues> & { config: GroupFieldConfig<TFormValues, any> }) => {
//     const currentPath = pathPrefix ? `${pathPrefix}.${name}` : name

//     const layoutClasses = {
//       horizontal: "flex space-x-4",
//       vertical: "space-y-4",
//       grid: "grid grid-cols-2 gap-4",
//     }

//     return (
//       <FormItem className={className}>
//         {config.label && (
//           <FormLabel text={config.label.text} required={config.label.required} className={config.label.className} />
//         )}
//         <div className={cn("p-4 border rounded-lg bg-card", layoutClasses[config.layout || "vertical"])}>
//           {Object.entries(config.fields).map(([fieldName, fieldConfig]) => (
//             <FieldRenderer
//               key={fieldName}
//               name={`${currentPath}.${fieldName}` as FormFieldPath<TFormValues>}
//               config={fieldConfig}
//               control={control}
//               disabled={disabled}
//               pathPrefix={currentPath}
//             />
//           ))}
//         </div>
//         {config.description && <FormDescription>{config.description}</FormDescription>}
//       </FormItem>
//     )
//   },
// )

// const ArrayRenderer = memo(
//   <TFormValues extends FieldValues>({
//     name,
//     config,
//     control,
//     disabled,
//     className,
//     pathPrefix = "",
//   }: FieldRendererProps<TFormValues> & { config: ArrayFieldConfig<TFormValues, any> }) => {
//     const currentPath = pathPrefix ? `${pathPrefix}.${name}` : name
//     const { methods } = useFormConfig<TFormValues>()

//     const { fields, append, remove, move } = useFieldArray({
//       control,
//       name: currentPath as any,
//       rules: {
//         minLength: config.minItems,
//         maxLength: config.maxItems,
//       },
//     })

//     const handleAddItem = useCallback(() => {
//       const defaultItem = Object.entries(config.itemConfig).reduce((acc, [key, fieldConfig]) => {
//         acc[key] = fieldConfig.defaultValue
//         return acc
//       }, {} as any)
//       append(defaultItem)
//     }, [append, config.itemConfig])

//     const handleRemoveItem = useCallback(
//       (index: number) => {
//         remove(index)
//       },
//       [remove],
//     )

//     const handleMoveItem = useCallback(
//       (from: number, to: number) => {
//         if (config.reorderable) {
//           move(from, to)
//         }
//       },
//       [move, config.reorderable],
//     )

//     return (
//       <FormItem className={className}>
//         {config.label && (
//           <FormLabel text={config.label.text} required={config.label.required} className={config.label.className} />
//         )}
//         <div className="space-y-3">
//           {fields.map((field, index) => (
//             <div key={field.id} className="relative p-4 border rounded-lg bg-card">
//               {config.reorderable && (
//                 <div className="absolute top-2 left-2 flex flex-col space-y-1">
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleMoveItem(index, Math.max(0, index - 1))}
//                     disabled={index === 0 || disabled}
//                     className="h-6 w-6 p-0"
//                   >
//                     ↑
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleMoveItem(index, Math.min(fields.length - 1, index + 1))}
//                     disabled={index === fields.length - 1 || disabled}
//                     className="h-6 w-6 p-0"
//                   >
//                     ↓
//                   </Button>
//                 </div>
//               )}

//               <div className={cn(config.reorderable && "ml-12", "space-y-3")}>
//                 {Object.entries(config.itemConfig).map(([fieldName, fieldConfig]) => (
//                   <FieldRenderer
//                     key={fieldName}
//                     name={`${currentPath}.${index}.${fieldName}` as FormFieldPath<TFormValues>}
//                     config={fieldConfig}
//                     control={control}
//                     disabled={disabled}
//                     pathPrefix={`${currentPath}.${index}`}
//                   />
//                 ))}
//               </div>

//               <Button
//                 type="button"
//                 variant="destructive"
//                 size="sm"
//                 onClick={() => handleRemoveItem(index)}
//                 disabled={disabled || (config.minItems !== undefined && fields.length <= config.minItems)}
//                 className="absolute top-2 right-2"
//               >
//                 {config.removeLabel || "Remove"}
//               </Button>
//             </div>
//           ))}

//           <Button
//             type="button"
//             variant="outline"
//             onClick={handleAddItem}
//             disabled={disabled || (config.maxItems !== undefined && fields.length >= config.maxItems)}
//             className="w-full"
//           >
//             {config.addLabel || "Add Item"}
//           </Button>
//         </div>

//         {config.description && <FormDescription>{config.description}</FormDescription>}
//       </FormItem>
//     )
//   },
// )

// const InfoRenderer = memo(
//   <TFormValues extends FieldValues>({ config, className }: FieldRendererProps<TFormValues> & { config: any }) => {
//     if (!isInfoField(config)) return null

//     return (
//       <InfoAlert
//         variant={config.variant}
//         title={config.title}
//         message={config.message || config.description}
//         className={className}
//       />
//     )
//   },
// )

// // === MAIN FIELD RENDERER ===
// const FieldRenderer = memo(
//   <TFormValues extends FieldValues>({
//     name,
//     config,
//     control,
//     disabled,
//     className,
//     pathPrefix,
//   }: FieldRendererProps<TFormValues>) => {
//     // Skip hidden fields
//     if (config.hidden) return null

//     // Info fields don't need form integration
//     if (isInfoField(config)) {
//       return <InfoRenderer name={name} config={config} control={control} className={className} />
//     }

//     // Type-safe field rendering based on config type
//     if (isInputField(config)) {
//       return <InputRenderer name={name} config={config} control={control} disabled={disabled} className={className} />
//     }

//     if (isTextareaField(config)) {
//       return (
//         <TextareaRenderer name={name} config={config} control={control} disabled={disabled} className={className} />
//       )
//     }

//     if (isCheckboxField(config)) {
//       return (
//         <CheckboxRenderer name={name} config={config} control={control} disabled={disabled} className={className} />
//       )
//     }

//     if (isSelectField(config)) {
//       return <SelectRenderer name={name} config={config} control={control} disabled={disabled} className={className} />
//     }

//     if (isGroupField(config)) {
//       return (
//         <GroupRenderer
//           name={name}
//           config={config}
//           control={control}
//           disabled={disabled}
//           className={className}
//           pathPrefix={pathPrefix}
//         />
//       )
//     }

//     if (isArrayField(config)) {
//       return (
//         <ArrayRenderer
//           name={name}
//           config={config}
//           control={control}
//           disabled={disabled}
//           className={className}
//           pathPrefix={pathPrefix}
//         />
//       )
//     }

//     // Add other field types as needed
//     // if (isMultiselectField(config)) { ... }
//     // if (isRadioField(config)) { ... }
//     // etc.

//     return (
//       <div className="p-4 bg-destructive/10 border border-destructive rounded">
//         <p className="text-destructive text-sm">Unsupported field type: {config.type}</p>
//       </div>
//     )
//   },
// )

// // === MAIN FORM COMPONENT ===
// export const Form = <TFormValues extends FieldValues = FieldValues>({
//   config,
//   methods: providedMethods,
//   defaultValues,
//   onSubmit,
//   onChange,
//   onError,
//   className,
//   fieldClassName,
//   labelClassName,
//   inputClassName,
//   submitButton,
//   shouldUnregister,
// }: FormProps<TFormValues>) => {
//   // Use provided methods (controlled) or create new ones (uncontrolled)
//   const internalMethods = useForm<TFormValues>({
//     defaultValues,
//     mode: config.mode || "onSubmit",
//     reValidateMode: config.reValidateMode || "onChange",
//     shouldFocusError: config.shouldFocusError ?? true,
//     shouldUnregister: shouldUnregister ?? false,
//   })

//   const methods = providedMethods || internalMethods
//   const { handleSubmit, formState, watch, control } = methods

//   // Watch for changes and call onChange
//   const watchedValues = useWatch({ control })
//   const prevValuesRef = React.useRef<TFormValues>()

//   React.useEffect(() => {
//     if (onChange && watchedValues !== prevValuesRef.current) {
//       const changedField = Object.keys(watchedValues || {}).find(
//         (key) => (watchedValues as any)?.[key] !== (prevValuesRef.current as any)?.[key],
//       ) as FormFieldPath<TFormValues> | undefined

//       onChange(watchedValues as Partial<TFormValues>, changedField)
//       prevValuesRef.current = watchedValues as TFormValues
//     }
//   }, [watchedValues, onChange])

//   // Handle form submission
//   const handleFormSubmit = useCallback(
//     async (data: TFormValues) => {
//       try {
//         await onSubmit?.(data)
//       } catch (error: any) {
//         console.error("Form submission error:", error)
//         onError?.({ root: { type: "manual", message: error.message } } as any)
//       }
//     },
//     [onSubmit, onError],
//   )

//   // Handle form errors
//   React.useEffect(() => {
//     if (formState.errors && Object.keys(formState.errors).length > 0) {
//       onError?.(formState.errors as any)
//     }
//   }, [formState.errors, onError])

//   // Determine field order
//   const fieldOrder = useMemo(() => {
//     return config.fieldOrder || Object.keys(config.fields)
//   }, [config.fieldOrder, config.fields])

//   // Context value for nested components
//   const contextValue = useMemo<FormContextValue<TFormValues>>(
//     () => ({
//       methods,
//       config,
//       disabled: formState.isSubmitting,
//       fieldClassName,
//       labelClassName,
//       inputClassName,
//     }),
//     [methods, config, formState.isSubmitting, fieldClassName, labelClassName, inputClassName],
//   )

//   return (
//     <FormProvider {...methods}>
//       <FormContext.Provider value={contextValue}>
//         <form
//           onSubmit={onSubmit ? handleSubmit(handleFormSubmit) : undefined}
//           className={cn("space-y-6", className)}
//           noValidate
//         >
//           {/* Form title and description */}
//           {config.title && (
//             <div className="space-y-2">
//               <h2 className="text-2xl font-semibold tracking-tight">{config.title}</h2>
//               {config.description && <FormDescription>{config.description}</FormDescription>}
//             </div>
//           )}

//           {/* Form fields */}
//           <div
//             className={cn(
//               "space-y-4",
//               config.layout === "grid" && "grid grid-cols-2 gap-4 space-y-0",
//               config.layout === "horizontal" && "flex flex-wrap gap-4 space-y-0",
//             )}
//           >
//             {fieldOrder.map((fieldKey) => {
//               const fieldConfig = config.fields[fieldKey as string]
//               if (!fieldConfig) {
//                 console.warn(`Field config not found for key: ${String(fieldKey)}`)
//                 return null
//               }

//               return (
//                 <FieldRenderer<TFormValues>
//                   key={String(fieldKey)}
//                   name={String(fieldKey) as FormFieldPath<TFormValues>}
//                   config={fieldConfig}
//                   control={control}
//                   disabled={formState.isSubmitting}
//                   className={fieldClassName}
//                 />
//               )
//             })}
//           </div>

//           {/* Global form errors */}
//           {formState.errors.root && <FormMessage message={get(formState.errors.root, "message") as string} />}

//           {/* Submit button */}
//           {submitButton !== false && onSubmit && (
//             <Button
//               type="submit"
//               disabled={formState.isSubmitting || submitButton?.disabled}
//               className={cn("w-full", submitButton?.className)}
//             >
//               {formState.isSubmitting ? "Submitting..." : submitButton?.text || "Submit"}
//             </Button>
//           )}
//         </form>
//       </FormContext.Provider>
//     </FormProvider>
//   )
// }

// // === EXPORTS ===
// export { useFormConfig, FieldRenderer }
// export type { FormContextValue }

const markdown = `# Sample Markdown Document

## Welcome to this **Markdown showcase**!  

 Here’s some *italics*, some **bold**, and some \`inline code\` 

---

## Math

Inline math example: $E = mc^2$  

Block math example:

$$
\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}
$$

---

## Lists

### Unordered list
- Item one
- Item two
  - Nested item
- Item three

### Ordered list
1. First
2. Second
   1. Nested
   2. Nested
3. Third

---

## Blockquote

> "Not everything that counts can be counted, and not everything that can be counted counts."  
> — *Albert Einstein*

---

## Code Blocks

Inline: \`console.log("Hello World")\`

Block:

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`
}
console.log(greet("Markdown"))`

type UserForm = {
  name: string
  email: string
  skills: string
  content: string
}

export default function FormExample() {
  const formConfig: FormConfig<UserForm> = {
    fields: {
      name: {
        type: "input",
        label: { title: "Name", required: true },
        defaultValue: "John Doe",
        validation: {
          required: true,
          minLength: {
            value: 2,
            message: "At least 2 chars is required",
          },
        },
        description: "Please enter your full name.",
      },
      content: {
        type: "markdown_input",
        label: {
          title: "Content",
        },
        defaultValue: markdown,
      },
      tos: {
        type: "checkbox",
        label: {
          title: "You are agree to our TOS?",
          position: "right",
        },
      },
      email: {
        type: "input",
        inputType: "email",
        label: {
          title: "Email",
          position: "left",
          required: true,
          description: "We'll never share your email with anyone else.",
        },
        description: "We'll never share your email with anyone else.",
        validation: {
          required: {
            value: true,
            message: "Email is required",
          },
        },
      },
      skills: {
        type: "select",
        label: {
          title: "Framework",
          position: "left",
        },
        options: [
          { id: "react", label: "React" },
          {
            id: "vue",
            label: "Vue",
          },
        ],
        defaultValue: "react",
      },
    },
  }

  return (
    <Form
      config={formConfig as any}
      onChange={(data) => {
        console.log("data", data)
      }}
      onSubmit={async (data) => {
        console.log(data.skills)
        // Fully typed and validated data
      }}
    />
  )
}
