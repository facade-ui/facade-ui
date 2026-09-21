import { HeroSplit } from "@registry/sections/hero-split"

import { ACTIONS, MediaPlaceholder } from "./content"

export function Demo() {
  return (
    <HeroSplit
      eyebrow="Sections"
      title="Build the page, not the primitives"
      description="Every section takes typed content and slots, so assembling a landing page is composition rather than another round of copy-paste."
      actions={ACTIONS}
      note="Works in any React 19 project."
      media={<MediaPlaceholder label="Product screenshot" />}
      headingLevel={1}
      spacing="md"
    />
  )
}
