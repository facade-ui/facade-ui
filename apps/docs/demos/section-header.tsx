import { Button } from "@registry/ui/button"
import { SectionHeader } from "@registry/ui/section-header"

export function Demo() {
  return (
    <div className="flex flex-col gap-14">
      <SectionHeader
        eyebrow="Features"
        title="Everything a marketing page needs"
        description="Composable sections that read like code you wrote yourself, because after install they are."
        actions={<Button variant="outline">Browse sections</Button>}
      />
      <SectionHeader
        align="center"
        size="lg"
        title="Centred, one size larger"
        description="Alignment and scale are independent of the heading level."
      />
    </div>
  )
}
