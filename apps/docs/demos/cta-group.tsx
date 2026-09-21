import { CtaGroup } from "@registry/ui/cta-group"

export function Demo() {
  return (
    <div className="flex flex-col gap-8">
      <CtaGroup
        items={[
          { label: "Start building", href: "#start" },
          { label: "Read the docs", href: "#docs" },
        ]}
      />
      <CtaGroup
        align="center"
        size="lg"
        items={[
          { label: "Get a demo", href: "#demo" },
          { label: "View on GitHub", href: "https://github.com", external: true },
        ]}
      />
    </div>
  )
}
