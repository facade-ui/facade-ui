import { Changelog } from "@registry/templates/changelog"

import { FOOTER_GROUPS, NAV_ITEMS, RELEASES } from "./content"

export function Demo() {
  return (
    <div className="-m-6 sm:-m-10">
      <Changelog
        currentPath="#changelog"
        content={{
          brand: "Facade UI",
          nav: [...NAV_ITEMS, { label: "Changelog", href: "#changelog" }],
          navActions: [{ label: "Get started", href: "#start" }],
          header: {
            eyebrow: "Changelog",
            title: "What is new in Facade UI",
            description: "New sections, fixes and the occasional breaking change.",
            actions: [
              { label: "RSS feed", href: "#rss", variant: "outline" },
              {
                label: "GitHub releases",
                href: "https://github.com",
                external: true,
                variant: "ghost",
              },
            ],
          },
          releases: RELEASES,
          subscribe: {
            title: "Get the next release by email",
            description: "One email per release. Nothing else.",
          },
          footer: {
            groups: FOOTER_GROUPS,
            copyright: "© 2026 Facade UI contributors",
          },
        }}
      />
    </div>
  )
}
