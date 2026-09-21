import { PricingTier } from "@registry/ui/pricing-tier"

export function Demo() {
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      <PricingTier
        name="Starter"
        price="$0"
        srPrice="Free"
        period="/month"
        description="Everything you need to ship a landing page."
        features={[
          { label: "All sections and atoms" },
          { label: "Three theme presets" },
          { label: "Priority support", included: false },
        ]}
        cta={{ label: "Start free", href: "#start" }}
      />
      <PricingTier
        featured
        name="Team"
        price="$29"
        srPrice="29 dollars"
        period="/month"
        description="For teams shipping more than one site."
        features={[
          { label: "Everything in Starter" },
          { label: "Shared theme tokens", note: "Sync across projects" },
          { label: "Priority support" },
        ]}
        cta={{ label: "Start a trial", href: "#trial" }}
        footnote="No card required for 14 days."
      />
    </ul>
  )
}
