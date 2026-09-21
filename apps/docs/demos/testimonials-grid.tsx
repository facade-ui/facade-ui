import { TestimonialsGrid } from "@registry/sections/testimonials-grid"

import { QUOTES } from "./content"

export function Demo() {
  return (
    <TestimonialsGrid
      eyebrow="Customers"
      title="What teams say"
      description="Masonry columns flow in document order, so reading order still matches what you see."
      items={QUOTES}
      columns="masonry"
    />
  )
}
