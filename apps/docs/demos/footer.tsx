import { Footer } from "@registry/sections/footer"

import { FOOTER_GROUPS } from "./content"

export function Demo() {
  return (
    <Footer
      brand={
        <div className="flex flex-col gap-2">
          <span className="text-base font-semibold tracking-tight">Facade UI</span>
          <p className="text-muted-foreground text-pretty text-sm">
            The front of every great website.
          </p>
        </div>
      }
      groups={FOOTER_GROUPS}
      copyright="© 2026 Facade UI contributors"
      legal={[
        { label: "Privacy", href: "#privacy" },
        { label: "Terms", href: "#terms" },
      ]}
      headingLevel={2}
    />
  )
}
