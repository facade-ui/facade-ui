import { Heading } from "@registry/ui/heading"

export function Demo() {
  return (
    <div className="flex flex-col gap-4">
      {/* Same visual size, four different outline levels. */}
      <Heading level={2} className="text-display-sm font-semibold">
        Rendered as h2
      </Heading>
      <Heading level={3} className="text-display-sm font-semibold">
        Rendered as h3
      </Heading>
      <Heading level={4} className="text-display-sm font-semibold">
        Rendered as h4
      </Heading>
      <p className="text-muted-foreground text-sm">
        Visual size is a class. The outline level is the <code>level</code> prop. Changing
        one never changes the other.
      </p>
    </div>
  )
}
