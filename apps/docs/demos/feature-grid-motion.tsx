"use client"

/**
 * The `feature-grid` demo, with the motion variant swapped in.
 *
 * Identical props: the motion variant only changes which slot components
 * the static section renders through.
 *
 * `"use client"` is required here, not incidental: the motion variant is a
 * client component, and icon components cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { FeatureGridMotion } from "@registry/sections/feature-grid-motion"

import { FEATURES } from "./content"

export function Demo() {
  return (
    <FeatureGridMotion
      eyebrow="Features"
      title="Everything a marketing page needs"
      description="Cards with an href become clickable through a stretched overlay, so the accessible name stays the title."
      items={FEATURES}
      columns={3}
    />
  )
}
