import { ButtonProps } from "../buttons/button"
import { MenuOption, MenuOptions } from "../types/menu-option"
import { Options } from "../types/option"
import React from "react"
import { FieldValues, UseFormReturn, DeepPartial, RegisterOptions, FieldPath, DefaultValues } from "react-hook-form"

// --- Helper & External Component Placeholder Types ---
export type Size = "xs" | "sm" | "md" | "lg"

export interface LabelProps {
  children?: React.ReactNode
  className?: string
  htmlFor?: string
  position?: "top" | "left" | "right" | "bottom"
  text?: string // From LabelConfig
}

export interface AlertVariantsProps {
  // For InfoFieldConfig
  variant?: "info" | "warning" | "error" | "success"
  title?: string
  // description prop is already on BaseFieldConfig
  // message?: string | React.ReactNode; // Added to InfoFieldConfigSchema directly
}

export interface Behavior {
  // Placeholder
  condition: (formValues: Record<string, any>) => boolean
  action: (methods: UseFormReturn<any>) => void // Example action
}

// --- RHF Validation Mapping ---
export interface ValidationRule<TValue, TMessage = string> {
  value: TValue
  message: TMessage
}

export interface Validation {
  required?: boolean | string
  min?: number | ValidationRule<number>
  max?: number | ValidationRule<number>
  minLength?: number | ValidationRule<number>
  maxLength?: number | ValidationRule<number>
  pattern?: RegExp | ValidationRule<RegExp>
  validate?: (
    value: any,
    formValues: Record<string, any>, // Pass all form values for context
  ) => boolean | string | Promise<boolean | string>
  // Add other RHF-compatible validation rules as needed
}

// --- Core Form & Field Types ---
export type FieldType =
  | "input"
  | "textarea"
  | "multi_input" // Needs a custom component, likely managing an array of strings/objects
  | "checkbox" // Single boolean checkbox
  | "chips" // Multi-select, value is likely string[] or Option[]
  | "radio" // Single select from options
  | "checkboxes" // Multiple selections from options, value is likely string[] or Option[]
  | "listbox" // Single select dropdown (like Radix Select)
  | "combobox" // Select dropdown with search/create capabilities
  | "group" // Nested fields structure
  | "multi_group" // Array of nested field structures (useFieldArray)
  | "color_picker"
  | "multi_color_picker" // Could be an array of colors or a component managing multiple pickers
  | "mentions" // Text input with @mention capabilities
  | "range" // Slider input
  | "info" // Non-interactive, display-only informational text/alert

export type FieldValue =
  | undefined
  | null
  | number
  | string
  | boolean
  | Array<string | number | MenuOption> // For multi-select type fields
  | GroupFieldValue
  | MultiGroupFieldValue

export type GroupFieldValue = { [key: string]: FieldValue }
export type MultiGroupFieldValue = GroupFieldValue[] // Array of groups

export type FieldAction = {
  label: string
  placement: "label_end" | "field_end"
  variant?: ButtonProps["variant"]
  size?: ButtonProps["size"]
  // onClick needs RHF methods and the specific field name (path)
  onClick: (methods: UseFormReturn<any>, fieldName: string) => void
  validateOnClick?: boolean // If true, might trigger validation for the field on click
}

// Base configuration for all fields
// TFormValues is the type of the entire form's values
// Using a generic here allows for better type inference for `validation.validate`'s `formValues` param
export interface BaseFieldConfigSchema<TFormValues extends FieldValues = FieldValues> {
  element: FieldType // Discriminator
  type?: React.HTMLInputTypeAttribute // For input element
  label?: Omit<LabelProps, "htmlFor" | "children"> & { text: string } // 'text' is required for label
  // `value` prop here is for *initial* value for a single field. RHF `defaultValues` at form level is preferred.
  // For Controller, this 'value' can act as its 'defaultValue' prop.
  value?: any
  invisible?: boolean
  disabled?: boolean
  placeholder?: string
  validation?: Validation
  debounce?: boolean | number // RHF doesn't handle debounce directly on register; custom component or logic needed.
  action?: FieldAction
  description?: string // Help text displayed under the field
  className?: string // For the FormItem wrapper div
  inputClassName?: string // For the actual input/select/custom component
}

// Specific field configurations using the Base
export interface InputFieldConfigSchema<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfigSchema<TFormValues> {
  element: "input"
}
export interface MultiInputFieldConfigSchema<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfigSchema<TFormValues> {
  element: "multi_input"
  // Example: allowDuplicates?: boolean;
}

export interface TextAreaConfigSchema<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfigSchema<TFormValues> {
  element: "textarea"
  rows?: number
}

export interface CheckboxConfigSchema<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfigSchema<TFormValues> {
  element: "checkbox"
  // Label for the checkbox itself if different from the FormItem label
  checkboxLabel?: string | (Omit<LabelProps, "htmlFor" | "children"> & { text: string })
}

export interface SelectionFieldConfigSchema<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfigSchema<TFormValues> {
  element: "radio" | "chips" | "checkboxes" | "mentions"
  options: Options
}

export interface DropDownFieldConfigSchema<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfigSchema<TFormValues> {
  element: "listbox" | "combobox"
  options: MenuOptions
  minItems?: number // For multi-select variants if applicable
  maxItems?: number // For multi-select variants if applicable
  enableReset?: boolean // For a reset button on the dropdown
  enableSearch?: boolean // Typically true for combobox, optional for listbox
  // isMulti?: boolean; // Useful for combobox to return array of values
}

export interface RangeInputFieldConfigSchema<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfigSchema<TFormValues> {
  element: "range"
  min?: number
  max?: number
  step?: number
}

export interface ColorPickerConfigSchema<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfigSchema<TFormValues> {
  element: "color_picker" | "multi_color_picker"
  // count?: number; // If multi_color_picker implies a fixed number of pickers
}

export interface InfoFieldConfigSchema<TFormValues extends FieldValues = FieldValues>
  extends BaseFieldConfigSchema<TFormValues>,
    Partial<AlertVariantsProps> {
  element: "info"
  message?: string | React.ReactNode // Explicit message for info component
}

// For Group and MultiGroup, TSubFormValues represents the shape of data *within* one group instance
export interface GroupFieldConfigSchema<
  TFormValues extends FieldValues = FieldValues,
  TSubFormValues extends GroupFieldValue = GroupFieldValue,
> extends BaseFieldConfigSchema<TFormValues> {
  element: "group"
  layout?: "horizontal" | "vertical" // For styling the group layout
  fields: FieldsMapSchema<TSubFormValues> // Fields within this group
}

export interface MultiGroupFieldConfigSchema<
  TFormValues extends FieldValues = FieldValues,
  TSubFormValues extends GroupFieldValue = GroupFieldValue, // Shape of one item in the array
> extends Omit<BaseFieldConfigSchema<TFormValues>, "value"> {
  // Value for multi_group is an array, handled by useFieldArray
  element: "multi_group"
  layout?: "horizontal" | "vertical"
  fields: FieldsMapSchema<TSubFormValues> // Template for fields in each group item
  minItems?: number
  maxItems?: number
  addItemLabel?: string
  removeItemLabel?: string
}

// Union of all possible field configurations.
// TFormValues is passed down to allow specific configs to reference the overall form shape if needed (e.g., for validation context).
export type AnyFieldConfigSchema<TFormValues extends FieldValues = FieldValues> =
  | InputFieldConfigSchema<TFormValues>
  | MultiInputFieldConfigSchema<TFormValues>
  | TextAreaConfigSchema<TFormValues>
  | CheckboxConfigSchema<TFormValues>
  | SelectionFieldConfigSchema<TFormValues> // covers radio, chips, checkboxes, mentions
  | DropDownFieldConfigSchema<TFormValues> // covers listbox, combobox
  | RangeInputFieldConfigSchema<TFormValues>
  | ColorPickerConfigSchema<TFormValues> // covers color_picker, multi_color_picker
  | InfoFieldConfigSchema<TFormValues>
  // Group and MultiGroup are more complex and might need careful handling of TSubFormValues
  | GroupFieldConfigSchema<TFormValues, any> // Using 'any' for TSubFormValues for simplicity here, can be refined
  | MultiGroupFieldConfigSchema<TFormValues, any> // Same 'any' for TSubFormValues

// Defines the structure for the 'fields' object in FormConfig.
// Keys are field names (paths for RHF), values are their specific configurations.
export type FieldsMapSchema<TFormValues extends FieldValues = FieldValues> = {
  // This provides stricter typing if TFormValues has known keys.
  // [P in keyof TFormValues]?: AnyFieldConfigSchema<TFormValues>; // This can be too restrictive if fields map doesn't cover all TFormValues
  //} & {
  // Allows arbitrary string keys, essential for dynamically defined forms or when TFormValues is Record<string, any>.
  [key: string]: AnyFieldConfigSchema<TFormValues>
}

// Form-level configuration
export interface FormConfig<TFormValues extends FieldValues = FieldValues> {
  fields: FieldsMapSchema<TFormValues>
  order?: (keyof TFormValues | string)[] // Order of top-level fields for rendering
  behaviors?: Behavior[] // For dynamic form behaviors based on conditions
  title?: string // Optional title for the form
  description?: string // Optional description for the form
}

// Props for the main RHF-driven Form component
export interface FormProps<TFormValues extends FieldValues = Record<string, any>> {
  formConfig: FormConfig<TFormValues>
  formMethods?: UseFormReturn<TFormValues> // Allow passing external form methods
  defaultValues?: DefaultValues<TFormValues>
  onValuesChange?: (values: TFormValues, changedFieldName?: FieldPath<TFormValues>) => void
  submitButtonText?: string
  submitButtonClassName?: string
  className?: string // ClassName for the <form> element
  // Global default classNames for form elements, can be overridden by individual field configs
  formItemClassName?: string
  formLabelClassName?: string
  formInputClassName?: string
  onSubmit: (data: TFormValues) => Promise<any> // or more specific response type
  onSuccess?: (response: any, values: TFormValues) => void
  onError?: (error: any, values: TFormValues) => void
}
