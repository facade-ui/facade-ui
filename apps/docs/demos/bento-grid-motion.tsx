"use client"

/**
 * The `bento-grid` demo, with the motion variant swapped in.
 *
 * Identical props: the motion variant only changes which slot components
 * the static section renders through.
 *
 * `"use client"` is required here, not incidental: the motion variant is a
 * client component, and icon components cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { BentoGridMotion } from "@registry/sections/bento-grid-motion"

import { BENTO } from "./content"

export function Demo() {
  return (
    <BentoGridMotion
      eyebrow="At a glance"
      title="A mosaic that still reads in order"
      description="Tiles are laid out in the order they are given — no dense packing, so reading order matches what you see."
      items={BENTO}
    />
  )
}
