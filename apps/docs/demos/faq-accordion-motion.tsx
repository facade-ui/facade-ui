"use client"

/**
 * The `faq-accordion` demo, with the motion variant swapped in.
 *
 * Identical props: the motion variant only changes which slot components
 * the static section renders through.
 *
 * `"use client"` is required here, not incidental: the motion variant is a
 * client component, and icon components cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { FaqAccordionMotion } from "@registry/sections/faq-accordion-motion"

import { FAQS } from "./content"

export function Demo() {
  return (
    <FaqAccordionMotion
      eyebrow="FAQ"
      title="Questions, answered"
      items={FAQS}
      defaultOpen={["faq-is-facade-ui-free"]}
      align="center"
      schemaOrg
    />
  )
}
