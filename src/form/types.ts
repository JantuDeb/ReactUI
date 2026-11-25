import { type EditorProps as TiptapEditorProps, type OnChangeParams as TiptapOnChangeParams } from "tiptap-editor-library/dist/components/editor"
import { ButtonProps } from "../buttons/button"
import { FileInputProps } from "../file-upload/file-input"
import { MarkdownInputProps } from "../inputs/markdown-input"
import { RadioGroupStyledProps } from "../inputs/radio-group"
import { SelectStyledProps } from "../inputs/select"
import { MenuOptions } from "../types/menu-option"
import React from "react"
import { FieldValues, UseFormReturn, DefaultValues, Control, FieldError } from "react-hook-form"

// === UTILITY TYPES ===
export type Size = "xs" | "sm" | "md" | "lg"

// Deep path type for nested field access
export type DeepKeys<T> =
  T extends ReadonlyArray<infer U>
    ? `${number}` | `${number}.${DeepKeys<U>}`
    : T extends Record<string, any>
      ? {
          [K in keyof T]: K extends string
            ? T[K] extends Record<string, any>
              ? `${K}` | `${K}.${DeepKeys<T[K]>}`
              : `${K}`
            : never
        }[keyof T]
      : never

export type FormFieldPath<T extends FieldValues> = DeepKeys<T> extends infer P ? (P extends string ? P : never) : never

// === COMPONENT PROP INTERFACES ===
export interface FormLabel {
  title: string
  position?: "top" | "left" | "right" | "bottom"
  className?: string
  required?: boolean
  description?: string
}

export interface AlertConfig {
  variant?: "info" | "warning" | "error" | "success"
  title?: string
  message?: string | React.ReactNode
}

export interface ValidationRule<ValueType> {
  value: ValueType
  message: string
}

export interface ValidationConfig<TFormValues extends FieldValues = FieldValues> {
  required?: boolean | ValidationRule<boolean>
  min?: number | ValidationRule<number>
  max?: number | ValidationRule<number>
  minLength?: number | ValidationRule<number>
  maxLength?: number | ValidationRule<number>
  pattern?: RegExp | { value: RegExp; message: string }
  validate?: (value: any, formValues: TFormValues) => boolean | string | Promise<boolean | string>
}

export interface FieldActionConfig<TFormValues extends FieldValues = FieldValues> {
  label: string
  placement: "label_end" | "field_end"
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  onClick: (methods: UseFormReturn<TFormValues>, fieldPath: FormFieldPath<TFormValues>) => void | Promise<void>
  validateOnClick?: boolean
}

// === CONDITIONAL VISIBILITY ===
export type FieldConditionOperator = "eq" | "neq" | "in" | "nin" | "gt" | "gte" | "lt" | "lte" | "empty" | "notempty"

export interface FieldConditionRule {
  field: string
  operator: FieldConditionOperator
  value?: any
}

export type FieldCondition =
  | FieldConditionRule
  | { and: FieldCondition[] }
  | { or: FieldCondition[] }
  | { not: FieldCondition }

// === BASE FIELD CONFIG ===
export interface BaseFieldConfig<TFormValues extends FieldValues = FieldValues> {
  // Core properties
  type: FieldType
  label?: FormLabel
  placeholder?: string
  description?: string
  disabled?: boolean
  hidden?: boolean
  className?: string

  // Declarative conditional visibility — serializable, server-config friendly
  conditions?: FieldCondition

  // Form integration (removed defaultValue)
  validation?: ValidationConfig<TFormValues>
  action?: FieldActionConfig<TFormValues>

  // Performance
  shouldUnregister?: boolean
  deps?: FormFieldPath<TFormValues>[] // Dependencies for re-validation
}

// === FIELD TYPES ===
export type FieldType =
  | "input"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "switch"
  | "slider"
  | "color_picker"
  | "date_picker"
  | "time_picker"
  | "group"
  | "array"
  | "info"
  | "file_input"
  | "markdown_input"
  | "tiptap_editor"

// === SPECIFIC FIELD CONFIGS ===
export interface InputFieldConfig<TFormValues extends FieldValues = FieldValues> extends BaseFieldConfig<TFormValues> {
  type: "input"
  inputType?: React.HTMLInputTypeAttribute
  prefix?: string
  suffix?: string
  maxLength?: number
  defaultValue?: string | number
  value?: string | number
}
export type TiptapEditorContent = TiptapOnChangeParams

export interface TiptapEditorFieldConfig<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFormValues>,
    Omit<TiptapEditorProps, "initialValue" | "onChange"> {
  type: "tiptap_editor"
  defaultValue?: TiptapEditorContent
  value?: TiptapEditorContent
}

export interface MarkdownFieldConfig<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFormValues>,
    Omit<MarkdownInputProps, "label"> {
  type: "markdown_input"
  maxLength?: number
  defaultValue?: string
  value?: string
}
export interface FileInputFieldConfig<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFormValues>,
    Omit<FileInputProps, "label"> {
  type: "file_input"
  prefix?: string
  suffix?: string
  // defaultValue?: UploadFile[]
  // value?: UploadFile[]
}

export interface TextareaFieldConfig<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFormValues> {
  type: "textarea"
  rows?: number
  cols?: number
  resize?: "none" | "vertical" | "horizontal" | "both"
  defaultValue?: string
  value?: string
}

export interface SelectFieldConfig<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFormValues>,
    Omit<SelectStyledProps, "onValueChange" | "onChange"> {
  type: "select"
  options: MenuOptions
  defaultValue?: string
  value?: string
  //   searchable?: boolean
  //   clearable?: boolean
  //   createable?: boolean
}

export interface MultiselectFieldConfig<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFormValues> {
  type: "multiselect"
  options: MenuOptions
  maxItems?: number
  defaultValue?: string[]
  value?: string[]
  //   searchable?: boolean
  //   clearable?: boolean
}

export interface CheckboxFieldConfig<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFormValues> {
  type: "checkbox"
  checkboxLabel?: string
  defaultValue?: boolean
  value?: boolean
}

export interface RadioFieldConfig<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFormValues>,
    Omit<RadioGroupStyledProps, "onValueChange"> {
  type: "radio"
  // options: Array<Option>
  // direction?: "horizontal" | "vertical"
  defaultValue?: string
  value?: string
}

export interface SwitchFieldConfig<TFormValues extends FieldValues = FieldValues> extends BaseFieldConfig<TFormValues> {
  type: "switch"
  switchLabel?: string
  defaultValue?: boolean
  value?: boolean
}

export interface SliderFieldConfig<TFormValues extends FieldValues = FieldValues> extends BaseFieldConfig<TFormValues> {
  type: "slider"
  min?: number
  max?: number
  step?: number
  marks?: boolean
  defaultValue?: number | [number, number] // single value or range
  value?: number | [number, number]
}

export interface ColorPickerFieldConfig<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFormValues> {
  type: "color_picker"
  format?: "hex" | "rgb" | "hsl"
  presets?: string[]
  defaultValue?: string
  value?: string
}

export interface DatePickerFieldConfig<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFormValues> {
  type: "date_picker"
  format?: string
  minDate?: Date
  maxDate?: Date
  defaultValue?: Date | string
  value?: Date | string
}

export interface TimePickerFieldConfig<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFormValues> {
  type: "time_picker"
  format?: "12" | "24"
  step?: number
  defaultValue?: string | Date
  value?: string | Date
}

export interface InfoFieldConfig<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfig<TFormValues>,
    AlertConfig {
  type: "info"
  // Info fields don't have values
}

// === COMPLEX FIELD CONFIGS ===
export interface GroupFieldConfig<
  TFormValues extends FieldValues = FieldValues,
  TGroupValue extends Record<string, any> = Record<string, any>,
> extends BaseFieldConfig<TFormValues> {
  type: "group"
  fields: FieldConfigMap<TGroupValue>
  layout?: "horizontal" | "vertical" | "grid"
  collapsible?: boolean
  defaultCollapsed?: boolean
  defaultValue?: Partial<TGroupValue>
  value?: Partial<TGroupValue>
  gridLayout?: {
    cols?: number
    spans?: Record<string, number>
  }
}

export interface ArrayFieldConfig<
  TFormValues extends FieldValues = FieldValues,
  TItemValue extends Record<string, any> = Record<string, any>,
> extends BaseFieldConfig<TFormValues> {
  type: "array"
  itemConfig: FieldConfigMap<TItemValue>
  itemLayouts?: string[][]
  minItems?: number
  maxItems?: number
  addLabel?: string
  removeLabel?: string
  reorderable?: boolean
  defaultValue?: TItemValue[]
  value?: TItemValue[]
}

// === UNION TYPES ===
export type AnyFieldConfig<TFormValues extends FieldValues = FieldValues> =
  | InputFieldConfig<TFormValues>
  | FileInputFieldConfig<TFormValues>
  | TextareaFieldConfig<TFormValues>
  | SelectFieldConfig<TFormValues>
  | MultiselectFieldConfig<TFormValues>
  | CheckboxFieldConfig<TFormValues>
  | RadioFieldConfig<TFormValues>
  | SwitchFieldConfig<TFormValues>
  | SliderFieldConfig<TFormValues>
  | ColorPickerFieldConfig<TFormValues>
  | DatePickerFieldConfig<TFormValues>
  | TimePickerFieldConfig<TFormValues>
  | GroupFieldConfig<TFormValues, any>
  | ArrayFieldConfig<TFormValues, any>
  | InfoFieldConfig<TFormValues>
  | MarkdownFieldConfig<TFormValues>
  | TiptapEditorFieldConfig<TFormValues>

export type FieldConfigMap<TFormValues extends FieldValues = FieldValues> = {
  [K in keyof TFormValues]?: AnyFieldConfig<TFormValues>
} & {
  [key: string]: AnyFieldConfig<TFormValues>
}

// === FORM CONFIG ===
export interface FormConfig<TFormValues extends FieldValues = FieldValues> {
  fields: FieldConfigMap<TFormValues>
  fieldOrder?: (keyof TFormValues)[]
  layouts?: string[][]
  title?: string
  description?: string
  layout?: "vertical" | "horizontal" | "grid"

  // Performance options
  mode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all"
  reValidateMode?: "onChange" | "onBlur" | "onSubmit"
  shouldFocusError?: boolean
  delayError?: number
  unflattenFormValues?: boolean
}

// === FORM PROPS ===
export interface FormProps<TFormValues extends FieldValues = FieldValues> {
  config: FormConfig<TFormValues>

  // Form methods (controlled mode)
  methods?: UseFormReturn<TFormValues>

  // Uncontrolled mode
  defaultValues?: DefaultValues<TFormValues>

  // Event handlers
  onSubmit?: (data: TFormValues) => void | Promise<any>
  onChange?: (data: Partial<TFormValues>, changedField?: FormFieldPath<TFormValues>) => void
  onError?: (errors: Error) => void
  onSuccess?: (reponse: any) => void

  // UI customization
  className?: string
  fieldClassName?: string
  labelClassName?: string
  inputClassName?: string

  // Submit button
  submitButton?:
    | {
        text?: string
        className?: string
        loading?: boolean
        disabled?: boolean
      }
    | false

  // Post-submit behaviour: "reset" restores defaultValues, "clear" empties all fields, "keep" (default) leaves form as-is
  afterSubmit?: "reset" | "clear" | "keep"

  // Performance
  shouldUnregister?: boolean
}

// === FIELD RENDERER PROPS ===
export interface FieldRendererProps<TFormValues extends FieldValues = FieldValues> {
  name: FormFieldPath<TFormValues>
  config: AnyFieldConfig<TFormValues>
  control: Control<TFormValues>
  disabled?: boolean
  className?: string

  // For nested fields
  pathPrefix?: string
  level?: number
}

// Base renderer props that work with RHF's Control variance
export interface BaseFieldRendererProps {
  name: string
  control: Control<any>
  disabled?: boolean
  className?: string
  pathPrefix?: string
  level?: number
}

// === FORM CONTEXT ===
export interface FormContextValue<TFormValues extends FieldValues = FieldValues> {
  methods: UseFormReturn<TFormValues>
  config: FormConfig<TFormValues>
  disabled?: boolean

  // Style context
  fieldClassName?: string
  labelClassName?: string
  inputClassName?: string
}
