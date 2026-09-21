"use client"

import { useState } from "react"

import { ProductLaunch } from "@registry/templates/product-launch"
import type { NewsletterStatus } from "@registry/sections/newsletter"

import {
  BENTO,
  FAQS,
  FOOTER_GROUPS,
  NAV_ITEMS,
  TABS,
  USPS,
  MediaPlaceholder,
} from "./content"

export function Demo() {
  const [status, setStatus] = useState<NewsletterStatus>("idle")

  return (
    <div className="-m-6 sm:-m-10">
      <ProductLaunch
        signUpStatus={status}
        signUpError="Enter a valid email address."
        onSignUp={(email) => {
          if (!email.includes("@")) {
            setStatus("error")
            return
          }
          setStatus("submitting")
          window.setTimeout(() => setStatus("success"), 900)
        }}
        content={{
          brand: "Facade UI",
          nav: NAV_ITEMS,
          navActions: [{ label: "Star on GitHub", href: "#github" }],
          announcement: {
            label: "Launch announcement",
            message: "Facade UI v0.1 is out.",
            action: { label: "Read the notes", href: "#release" },
          },
          hero: {
            eyebrow: "Now available",
            title: "Sixty-two pieces, one system",
            description:
              "Sections, atoms, motion and three verified themes. Install what you need; the source is yours.",
            actions: [
              { label: "Get started", href: "#start" },
              { label: "Browse components", href: "#components" },
            ],
            note: "MIT licensed.",
            media: <MediaPlaceholder label="Launch screenshot" ratio="aspect-[16/8]" />,
          },
          highlights: {
            eyebrow: "At a glance",
            title: "What is in the box",
            items: BENTO,
          },
          usps: { eyebrow: "Why", title: "Three things that matter", items: USPS },
          detail: {
            eyebrow: "How it works",
            title: "Three steps, one system",
            items: TABS,
          },
          faq: { eyebrow: "FAQ", title: "Questions, answered", items: FAQS },
          signup: {
            eyebrow: "Changelog",
            title: "One email when something ships",
            description: "No drip campaign, no webinar invitations.",
            note: "Unsubscribe in one click.",
          },
          footer: {
            groups: FOOTER_GROUPS,
            copyright: "© 2026 Facade UI contributors",
            legal: [{ label: "Privacy", href: "#privacy" }],
          },
        }}
      />
    </div>
  )
}
