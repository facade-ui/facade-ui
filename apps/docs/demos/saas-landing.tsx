"use client"

/**
 * `"use client"` because the template's feature grid carries icon components,
 * and NavTop below it is a client component — icons cannot cross a
 * server-to-client boundary as props. See the note on `IconComponent`.
 */

import { SaasLanding } from "@registry/templates/saas-landing"

import {
  ACTIONS,
  FAQS,
  FEATURES,
  FOOTER_GROUPS,
  LOGOS,
  MediaPlaceholder,
  NAV_ITEMS,
  PLANS,
  QUOTES,
  ROWS,
  STATS,
} from "./content"

export function Demo() {
  return (
    <div className="-m-6 sm:-m-10">
      <SaasLanding
        currentPath="#pricing"
        content={{
          brand: "Facade UI",
          nav: NAV_ITEMS,
          navActions: [
            { label: "Sign in", href: "#sign-in", variant: "ghost" },
            { label: "Start free", href: "#start" },
          ],
          hero: {
            eyebrow: "Free and open source",
            title: "The front of every great website",
            description:
              "Marketing sections and a design system you install with the shadcn CLI. The source lands in your project — yours to read, change and own.",
            actions: ACTIONS,
            note: "MIT licensed. No account, no gating.",
            media: <MediaPlaceholder label="Product screenshot" />,
          },
          logos: { title: "Trusted by teams shipping every day", items: LOGOS },
          features: {
            eyebrow: "Features",
            title: "Everything a marketing page needs",
            description: "Composable sections that take typed content and slots.",
            items: FEATURES,
          },
          rows: {
            eyebrow: "How it works",
            title: "Install a piece, own the source",
            items: ROWS,
          },
          stats: {
            eyebrow: "By the numbers",
            title: "What the checks cover",
            items: STATS,
          },
          testimonials: {
            eyebrow: "Customers",
            title: "What teams say",
            items: QUOTES.slice(0, 3),
          },
          pricing: {
            eyebrow: "Pricing",
            title: "Simple, and actually free",
            items: PLANS,
            note: "All prices exclude VAT.",
          },
          faq: { eyebrow: "FAQ", title: "Questions, answered", items: FAQS },
          cta: {
            title: "Ready when you are",
            description:
              "Install the first section and see how it sits in your own theme.",
            actions: [{ label: "Get started", href: "#start" }],
          },
          footer: {
            groups: FOOTER_GROUPS,
            copyright: "© 2026 Facade UI contributors",
            legal: [
              { label: "Privacy", href: "#privacy" },
              { label: "Terms", href: "#terms" },
            ],
          },
        }}
      />
    </div>
  )
}
