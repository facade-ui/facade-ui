import { Eyebrow } from "@registry/ui/eyebrow"
import { Heading } from "@registry/ui/heading"

export function Demo() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Eyebrow>Platform</Eyebrow>
        <Heading level={2} className="text-display-sm font-semibold">
          One place for everything
        </Heading>
      </div>
      <div className="flex flex-col gap-2">
        <Eyebrow tone="primary">Changelog</Eyebrow>
        <Heading level={2} className="text-display-sm font-semibold">
          Shipped this week
        </Heading>
      </div>
    </div>
  )
}
