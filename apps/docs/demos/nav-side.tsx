import { NavSide } from "@registry/sections/nav-side"

const groups = [
  {
    title: "Getting started",
    links: [
      { label: "Installation", href: "#installation" },
      { label: "Theming", href: "#theming" },
      { label: "Accessibility", href: "#accessibility" },
    ],
  },
  {
    title: "Atoms",
    collapsible: true,
    links: [
      { label: "Button", href: "#button" },
      { label: "Badge", href: "#badge" },
      { label: "Input", href: "#input" },
    ],
  },
  {
    title: "Sections",
    collapsible: true,
    defaultCollapsed: true,
    links: [
      { label: "Hero", href: "#hero" },
      { label: "Feature grid", href: "#feature-grid" },
      { label: "FAQ", href: "#faq" },
    ],
  },
]

export function Demo() {
  return (
    <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <NavSide label="Documentation" groups={groups} currentPath="#theming" />
      <div className="text-muted-foreground text-sm">
        Below <code>lg</code> the sidebar collapses to a drawer. The group holding the
        current page is always expanded, even when it is marked{" "}
        <code>defaultCollapsed</code>.
      </div>
    </div>
  )
}
