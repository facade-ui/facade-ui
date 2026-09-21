import { PricingComparison } from "@registry/sections/pricing-comparison"

import { COMPARISON_GROUPS, COMPARISON_PLANS } from "./content"

export function Demo() {
  return (
    <PricingComparison
      eyebrow="Compare"
      title="Every feature, plan by plan"
      plans={COMPARISON_PLANS}
      groups={COMPARISON_GROUPS}
      note="A tick is never the only thing in a cell — each carries hidden 'Included' text."
    />
  )
}
