"use client"

/**
 * The `testimonials-grid` demo, with the motion variant swapped in.
 *
 * Identical props: the motion variant only changes which slot components
 * the static section renders through.
 *
 * `"use client"` is required here, not incidental: the motion variant is a
 * client component, and icon components cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { TestimonialsGridMotion } from "@registry/sections/testimonials-grid-motion"

import { QUOTES } from "./content"

export function Demo() {
  return (
    <TestimonialsGridMotion
      eyebrow="Customers"
      title="What teams say"
      description="Masonry columns flow in document order, so reading order still matches what you see."
      items={QUOTES}
      columns="masonry"
    />
  )
}
