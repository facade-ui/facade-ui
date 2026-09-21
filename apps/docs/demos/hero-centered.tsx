import { Badge } from "@registry/ui/badge"
import { HeroCentered } from "@registry/sections/hero-centered"

import { ACTIONS } from "./content"

export function Demo() {
  return (
    <HeroCentered
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
