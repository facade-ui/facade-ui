"use client"

/**
 * The `stats` demo, with the motion variant swapped in.
 *
 * Identical props: the motion variant only changes which slot components
 * the static section renders through.
 *
 * `"use client"` is required here, not incidental: the motion variant is a
 * client component, and icon components cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { StatsMotion } from "@registry/sections/stats-motion"

import { STATS } from "./content"

export function Demo() {
  return (
    <StatsMotion
      eyebrow="By the numbers"
      title="What the checks actually cover"
      items={STATS}
      variant="card"
    />
  )
}
