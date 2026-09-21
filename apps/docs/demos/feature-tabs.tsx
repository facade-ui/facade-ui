"use client"

/**
 * `"use client"` is required, not incidental: FeatureTabs is a client component
 * and the tab items carry icon components, which cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { FeatureTabs } from "@registry/sections/feature-tabs"

import { TABS } from "./content"

export function Demo() {
  return (
    <FeatureTabs
      eyebrow="How it works"
      title="Three steps, one system"
      description="Arrow through the tabs: focus moves without switching panels. Enter or Space selects."
      items={TABS}
    />
  )
}
