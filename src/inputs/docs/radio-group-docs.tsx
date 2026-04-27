import { useState } from "react"
import { RadioGroupStyled } from "../radio-group"

// Example 1: SaaS Plans
const planOptions = [
  { id: "plan-starter", label: "Starter", description: "Perfect for individuals getting started" },
  { id: "plan-pro", label: "Pro", description: "Advanced features for small teams" },
  { id: "plan-enterprise", label: "Enterprise", description: "Custom solutions for large organizations" },
]

// Example 2: Shipping methods
const shippingOptions = [
  { id: "ship-standard", label: "Standard", description: "3–5 business days" },
  { id: "ship-express", label: "Express", description: "1–2 business days" },
  { id: "ship-overnight", label: "Overnight", description: "Next day delivery" },
]

// Example 3: Shoe Sizes
const shoeSizes = [
  { id: "size-6", label: "Size: 6 (UK)" },
  { id: "size-7", label: "Size: 7 (UK)", disabled: true },
  { id: "size-8", label: "Size: 8 (UK)" },
  { id: "size-9", label: "Size: 9 (UK)" },
  { id: "size-10", label: "Size: 10 (UK)" },
]

// Example 4: Subscription tiers
const subscriptionPlans = [
  {
    id: "sub-basic",
    label: "Basic",
    description: "Get 1 project with 1 team member",
    badge: "Free",
  },
  {
    id: "sub-premium",
    label: "Premium",
    description: "Get 5 projects with 5 team members",
    badge: "$24/mo",
  },
  {
    id: "sub-business",
    label: "Business",
    description: "Unlimited projects and priority support",
    badge: "$99/mo",
  },
]

// Example 5: Theme choices
const themeOptions = [
  { id: "theme-light", label: "Light Mode", description: "Bright and clean" },
  { id: "theme-dark", label: "Dark Mode", description: "Dimmed for low-light environments" },
  { id: "theme-system", label: "System Default", description: "Follow your OS preference" },
]

// Example: Basic options without description
const colorOptions = [
  { id: "color-red", label: "Red" },
  { id: "color-blue", label: "Blue" },
  { id: "color-green", label: "Green" },
]

const paymentOptions = [
  { id: "pay-card", label: "Credit / Debit Card" },
  { id: "pay-paypal", label: "PayPal" },
  { id: "pay-bank", label: "Bank Transfer" },
]

const countryOptions = [
  { id: "country-us", label: "United States" },
  { id: "country-in", label: "India" },
  { id: "country-de", label: "Germany" },
]

export default function RadioGroupDocs() {
  const [value1, setValue1] = useState("1")
  const [value2, setValue2] = useState("2")
  const [value3, setValue3] = useState("3")

  return (
    <div className="space-y-8 p-4">
      <div className="flex gap-6 justify-between w-full">
        <div className="space-y-6">
          <h3 className="mb-2 font-semibold">Basic Horizontal (no description)</h3>
          <RadioGroupStyled options={colorOptions} layout="horizontal" />
        </div>

        <div className="space-y-6">
          <h3 className="mb-2 font-semibold"> Basic Vertical</h3>
          <RadioGroupStyled options={paymentOptions} layout="vertical" />
        </div>
        <div className="space-y-6">
          <h3 className="mb-2 font-semibold"> Basic Grid (3 columns)</h3>
          <RadioGroupStyled options={countryOptions} layout="grid3" />
        </div>
      </div>

      <div className="space-x-6 flex">
        <div>
          <h3 className="mb-2 font-semibold">Item Variant (Button) </h3>
          <RadioGroupStyled
            options={shoeSizes}
            /*  onValueChange={setValue2} */
            layout="horizontal"
            itemVariant="button"
          />
        </div>

        <div>
          <h3 className="mb-2 font-semibold"> Item Variant (Button) - Hidden Radio</h3>
          <RadioGroupStyled
            options={shippingOptions}
            /*  onValueChange={setValue2} */
            layout="grid3"
            itemVariant="button"
            itemVisibility="hidden"
          />
        </div>
      </div>

      <div className="gap-6 flex">
        <div className="space-y-6">
          <h3 className="mb-2 font-semibold">Item Variant (Card)</h3>
          <RadioGroupStyled
            options={subscriptionPlans}
            /*  onValueChange={setValue2} */ layout="vertical"
            itemVariant="card"
          />
        </div>
        <div className="space-y-6">
          <h3 className="mb-2 font-semibold"> Item Variant (Card) - Hidden Radio</h3>
          <RadioGroupStyled
            options={planOptions}
            /*  onValueChange={setValue2} */
            itemVisibility="hidden"
            layout="vertical"
            itemVariant="card"
          />
        </div>
      </div>
    </div>
  )
}
