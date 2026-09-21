import { HeroWithMedia } from "@registry/sections/hero-with-media"

import { ACTIONS } from "./content"

export function Demo() {
  return (
    <HeroWithMedia
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
