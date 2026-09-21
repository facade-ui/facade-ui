"use client"

/**
 * `"use client"` because the process steps carry icon components and NavTop is
 * a client component — icons cannot cross a server-to-client boundary as props.
 */

import { Agency } from "@registry/templates/agency"

import {
  FOOTER_GROUPS,
  LOGOS,
  NAV_ITEMS,
  POSTS,
  QUOTES,
  STATS,
  STEPS,
  TEAM,
} from "./content"

export function Demo() {
  return (
    <div className="-m-6 sm:-m-10">
      <Agency
        content={{
          brand: "Facade Studio",
          nav: NAV_ITEMS,
          navActions: [{ label: "Start a project", href: "#contact" }],
          hero: {
            eyebrow: "Design and engineering",
            title: "We build the front of the business",
            description:
              "Marketing sites, design systems and the handover that makes them last.",
            actions: [
              { label: "See our work", href: "#work" },
              { label: "Start a project", href: "#contact" },
            ],
            // Decorative: it says nothing the copy does not.
            media: (
              <div
                role="presentation"
                className="size-full bg-[radial-gradient(circle_at_25%_25%,#2f3d5c,transparent_55%),radial-gradient(circle_at_75%_35%,#5c3350,transparent_50%),linear-gradient(150deg,#12151d,#2b2340)]"
              />
            ),
          },
          clients: { title: "Selected clients", items: LOGOS },
          work: {
            eyebrow: "Work",
            title: "Recent projects",
            description: "A few of the sites and systems we have shipped.",
            items: POSTS,
          },
          process: {
            eyebrow: "Process",
            title: "How we work",
            items: STEPS,
          },
          quote: { title: "Client story", item: QUOTES[0]! },
          stats: {
            eyebrow: "Track record",
            title: "In numbers",
            items: STATS.slice(0, 3),
          },
          team: { eyebrow: "Studio", title: "Who you will work with", items: TEAM },
          cta: {
            title: "Have something in mind?",
            description:
              "Tell us what you are building and we will tell you how we would approach it.",
            actions: [{ label: "Start a project", href: "#contact" }],
          },
          footer: {
            groups: FOOTER_GROUPS.slice(0, 2),
            copyright: "© 2026 Facade Studio",
            legal: [{ label: "Privacy", href: "#privacy" }],
          },
        }}
      />
    </div>
  )
}
