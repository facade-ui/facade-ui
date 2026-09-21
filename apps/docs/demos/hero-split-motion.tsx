"use client"

/**
 * The `hero-split` demo, with the motion variant swapped in.
 *
 * Identical props: the motion variant only changes which slot components
 * the static section renders through.
 *
 * `"use client"` is required here, not incidental: the motion variant is a
 * client component, and icon components cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { HeroSplitMotion } from "@registry/sections/hero-split-motion"

import { ACTIONS, MediaPlaceholder } from "./content"

export function Demo() {
  return (
    <HeroSplitMotion
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
