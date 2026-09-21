import { FaqAccordion } from "@registry/sections/faq-accordion"

import { FAQS } from "./content"

export function Demo() {
  return (
    <FaqAccordion
      eyebrow="FAQ"
      title="Questions, answered"
      items={FAQS}
      defaultOpen={["faq-is-facade-ui-free"]}
      align="center"
      schemaOrg
    />
  )
}
