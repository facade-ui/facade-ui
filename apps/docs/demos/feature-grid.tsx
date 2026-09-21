import { FeatureGrid } from "@registry/sections/feature-grid"

import { FEATURES } from "./content"

export function Demo() {
  return (
    <FeatureGrid
      eyebrow="Features"
      title="Everything a marketing page needs"
      description="Cards with an href become clickable through a stretched overlay, so the accessible name stays the title."
      items={FEATURES}
      columns={3}
    />
  )
}
