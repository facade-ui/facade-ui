"use client"

/**
 * The `hero-with-media` demo, with the motion variant swapped in.
 *
 * Identical props: the motion variant only changes which slot components
 * the static section renders through.
 *
 * `"use client"` is required here, not incidental: the motion variant is a
 * client component, and icon components cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { HeroWithMediaMotion } from "@registry/sections/hero-with-media-motion"

import { ACTIONS } from "./content"

export function Demo() {
  return (
    <HeroWithMediaMotion
      eyebrow="Overlay"
      title="Copy over media, with contrast guaranteed"
      description="The scrim is always painted, because text over an arbitrary image has no predictable contrast ratio."
      actions={ACTIONS}
      headingLevel={1}
      spacing="md"
      // Decorative: it carries nothing the copy does not already say.
      media={
        <div
          role="presentation"
          className="size-full bg-[radial-gradient(circle_at_20%_20%,#3b4a6b,transparent_55%),radial-gradient(circle_at_80%_30%,#6b3b5a,transparent_50%),linear-gradient(140deg,#11151f,#2a2140)]"
        />
      }
    />
  )
}
