"use client"

/**
 * The `steps` demo, with the motion variant swapped in.
 *
 * Identical props: the motion variant only changes which slot components
 * the static section renders through.
 *
 * `"use client"` is required here, not incidental: the motion variant is a
 * client component, and icon components cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { StepsMotion } from "@registry/sections/steps-motion"

import { STEPS } from "./content"

export function Demo() {
  return (
    <StepsMotion
      eyebrow="Getting started"
      title="From nothing to a landing page"
      description="An ordered list, so a screen reader already announces 'step 2 of 3' without the numeral being read twice."
      items={STEPS}
    />
  )
}
