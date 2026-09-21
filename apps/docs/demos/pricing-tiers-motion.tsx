"use client"

/**
 * The `pricing-tiers` demo, with the motion variant swapped in.
 *
 * Identical props: the motion variant only changes which slot components
 * the static section renders through.
 *
 * `"use client"` is required here, not incidental: the motion variant is a
 * client component, and icon components cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { PricingTiersMotion } from "@registry/sections/pricing-tiers-motion"

import { PLANS } from "./content"

export function Demo() {
  return (
    <PricingTiersMotion
      eyebrow="Pricing"
      title="Simple, and actually free"
      description="Prices carry a spoken form, and a feature that is not included says so in words."
      items={PLANS}
      note="All prices exclude VAT."
    />
  )
}
