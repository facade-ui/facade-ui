import { Select } from "@registry/ui/select"

const COUNTRIES = [
  { value: "nl", label: "Netherlands" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "be", label: "Belgium" },
  { value: "xx", label: "Atlantis", disabled: true },
]

const PLANS = [
  { value: "starter", label: "Starter" },
  { value: "team", label: "Team" },
  { value: "enterprise", label: "Enterprise" },
]

export function Demo() {
  return (
    <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
      <Select
        label="Country"
        name="country"
        items={COUNTRIES}
        placeholder="Choose a country"
        description="Where the invoice is addressed."
        required
      />
      <Select
        label="Plan"
        name="plan"
        items={PLANS}
        defaultValue="enterprise"
        error="Enterprise needs a sales call first."
      />
    </div>
  )
}
