import { TestimonialSingle } from "@registry/sections/testimonial-single"

import { QUOTES } from "./content"

export function Demo() {
  return <TestimonialSingle title="Customer story" item={QUOTES[0]!} variant="muted" />
}
