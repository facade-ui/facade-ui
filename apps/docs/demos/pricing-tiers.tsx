import { PricingTiers } from "@registry/sections/pricing-tiers"

import { PLANS } from "./content"

export function Demo() {
  return (
    <PricingTiers
      eyebrow="Pricing"
      title="Simple, and actually free"
      description="Prices carry a spoken form, and a feature that is not included says so in words."
      items={PLANS}
      note="All prices exclude VAT."
    />
  )
}
