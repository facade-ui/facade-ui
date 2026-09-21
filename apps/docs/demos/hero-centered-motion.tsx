"use client"

/**
 * The `hero-centered` demo, with the motion variant swapped in.
 *
 * Identical props: the motion variant only changes which slot components
 * the static section renders through.
 *
 * `"use client"` is required here, not incidental: the motion variant is a
 * client component, and icon components cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { Badge } from "@registry/ui/badge"
import { HeroCenteredMotion } from "@registry/sections/hero-centered-motion"

import { ACTIONS } from "./content"

export function Demo() {
  return (
    <HeroCenteredMotion
      banner={<Badge variant="outline">v0.1 is out</Badge>}
      eyebrow="Free and open source"
      title="The front of every great website"
      description="Marketing sections and a design system you install with the shadcn CLI. The source lands in your project — yours to read, change and own."
      actions={ACTIONS}
      note="MIT licensed. No account, no gating."
      headingLevel={1}
      spacing="md"
    />
  )
}
