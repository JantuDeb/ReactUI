/**
 * Form Component Documentation & Examples
 *
 * GROUP FIELD FEATURE:
 * -------------------
 * Group fields nest related fields under a key in the form data.
 * Example: address group → { address: { street: "...", city: "..." } }
 *
 * GROUP LAYOUT OPTIONS:
 * - vertical (default): Stack fields vertically
 * - horizontal: Arrange fields in a row
 * - grid: Use CSS grid with customizable columns and spans
 *
 * GROUP GRID LAYOUT:
 * - cols: Total number of columns (default: 12)
 * - spans: Object mapping field keys to their column span
 *   Example: { street: 8, zipCode: 4 } in a 12-column grid
 *
 * FORM-LEVEL LAYOUTS:
 * -------------------
 * Use `layouts` on the FormConfig to arrange top-level fields into rows
 * without nesting them in a group. Each inner array is a row rendered
 * as a flex row with equal-width fields.
 * Example: layouts: [["phone", "country"], ["name"]]
 *
 * CONDITIONAL FIELDS — `conditions`
 * -----------------------------------
 * Fields can be shown/hidden declaratively using the `conditions` property.
 * It is fully serializable (plain JSON), so configs can come from a server.
 * When a field is hidden it is unregistered from the form, so its value is
 * excluded from submission and its validation rules never fire.
 *
 * Single rule:
 *   conditions: { field: "payment_method", operator: "eq", value: "card" }
 *
 * Operators:
 *   eq / neq       — strict equality / inequality
 *   in / nin       — value is (not) in an array:  { operator: "in", value: ["a","b"] }
 *   gt / gte       — greater than (or equal)
 *   lt / lte       — less than (or equal)
 *   empty          — null, "", or []
 *   notempty       — the opposite of empty
 *
 * Compound logic (nest freely):
 *   conditions: {
 *     and: [
 *       { field: "role", operator: "in", value: ["admin", "editor"] },
 *       { field: "is_active", operator: "eq", value: true },
 *     ]
 *   }
 *
 *   conditions: {
 *     or: [
 *       { field: "plan", operator: "eq", value: "pro" },
 *       { not: { field: "trial_expired", operator: "eq", value: true } },
 *     ]
 *   }
 *
 * Nested field paths (dot notation):
 *   conditions: { field: "address.country", operator: "neq", value: "US" }
 */

import { Form } from "./index"

import { FormConfig } from "./types"

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
  richContent: any
  tos: boolean
  address: {
    street: string
    city: string
    zipCode: string
  }
  phone: string
  country: string
}

// --- Conditions example ---
type PaymentForm = {
  payment_method: string
  card_number: string
  card_expiry: string
  bank_account: string
  promo_code: string
  has_promo: boolean
}

export function ConditionsExample() {
  const formConfig: FormConfig<PaymentForm> = {
    fields: {
      payment_method: {
        type: "select",
        label: { title: "Payment Method", required: true },
        options: [
          { id: "card", label: "Credit / Debit Card" },
          { id: "bank", label: "Bank Transfer" },
        ],
        validation: { required: true },
      },
      // Shown only when payment_method === "card"
      card_number: {
        type: "input",
        label: { title: "Card Number", required: true },
        placeholder: "1234 5678 9012 3456",
        conditions: { field: "payment_method", operator: "eq", value: "card" },
        validation: { required: true },
      },
      card_expiry: {
        type: "input",
        label: { title: "Expiry Date", required: true },
        placeholder: "MM/YY",
        conditions: { field: "payment_method", operator: "eq", value: "card" },
        validation: { required: true },
      },
      // Shown only when payment_method === "bank"
      bank_account: {
        type: "input",
        label: { title: "Bank Account Number", required: true },
        placeholder: "IBAN / account number",
        conditions: { field: "payment_method", operator: "eq", value: "bank" },
        validation: { required: true },
      },
      // Checkbox to toggle promo field
      has_promo: {
        type: "checkbox",
        label: { title: "I have a promo code", position: "right" },
      },
      // Shown only when has_promo is checked — compound condition example
      promo_code: {
        type: "input",
        label: { title: "Promo Code", required: true },
        placeholder: "SUMMER2025",
        conditions: {
          and: [
            { field: "has_promo", operator: "eq", value: true },
            { field: "payment_method", operator: "notempty" },
          ],
        },
        validation: { required: true },
      },
    },
  }

  return (
    <Form
      config={formConfig}
      onSubmit={async (data) => {
        console.log("payment data", data)
      }}
    />
  )
}

export default function FormExample() {
  const formConfig: FormConfig<UserForm> = {
    layouts: [
      ["name"],
      ["content"],
      ["richContent"],
      ["tos"],
      ["email", "skills"],
      ["address"],
      ["phone", "country"],
    ],
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
      richContent: {
        type: "tiptap_editor",
        label: { title: "Rich Content" },
        contentType: "markdown",
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
      // Nested Group Field Example (Vertical Layout)
      // Values will be stored as { street: "...", city: "...", zipCode: "..." } under the "address" key
      address: {
        type: "group",
        label: {
          title: "Address (Nested Group - Vertical)",
        },
        layout: "vertical",
        fields: {
          street: {
            type: "input",
            label: {
              title: "Street",
            },
            placeholder: "123 Main St",
          },
          city: {
            type: "input",
            label: {
              title: "City",
            },
            placeholder: "New York",
          },
          zipCode: {
            type: "input",
            label: {
              title: "ZIP Code",
            },
            placeholder: "10001",
          },
        },
      },
      // Top-level fields laid out side-by-side via the `layouts` prop above
      phone: {
        type: "input",
        label: { title: "Phone Number" },
        placeholder: "+1 (555) 123-4567",
      },
      country: {
        type: "select",
        label: { title: "Country" },
        options: [
          { id: "us", label: "United States" },
          { id: "ca", label: "Canada" },
          { id: "uk", label: "United Kingdom" },
        ],
        defaultValue: "us",
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
