"use client"

/**
 * The `feature-rows` demo, with the motion variant swapped in.
 *
 * Identical props: the motion variant only changes which slot components
 * the static section renders through.
 *
 * `"use client"` is required here, not incidental: the motion variant is a
 * client component, and icon components cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { FeatureRowsMotion } from "@registry/sections/feature-rows-motion"

import { ROWS } from "./content"

export function Demo() {
  return (
    <FeatureRowsMotion
      eyebrow="How it works"
      title="Install a piece, own the source"
      items={ROWS}
      align="center"
    />
  )
}
