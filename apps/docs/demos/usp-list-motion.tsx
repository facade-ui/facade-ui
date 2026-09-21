"use client"

/**
 * The `usp-list` demo, with the motion variant swapped in.
 *
 * Identical props: the motion variant only changes which slot components
 * the static section renders through.
 *
 * `"use client"` is required here, not incidental: the motion variant is a
 * client component, and icon components cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { UspListMotion } from "@registry/sections/usp-list-motion"

import { USPS } from "./content"

export function Demo() {
  return (
    <UspListMotion
      eyebrow="Why"
      title="Three things that matter"
      description="Code quality, accessibility and composability are the product."
      items={USPS}
    />
  )
}
