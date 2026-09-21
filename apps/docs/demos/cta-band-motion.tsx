"use client"

/**
 * The `cta-band` demo, with the motion variant swapped in.
 *
 * Identical props: the motion variant only changes which slot components
 * the static section renders through.
 *
 * `"use client"` is required here, not incidental: the motion variant is a
 * client component, and icon components cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { CtaBandMotion } from "@registry/sections/cta-band-motion"

import { ACTIONS } from "./content"

export function Demo() {
  return (
    <div className="flex flex-col gap-10">
      <CtaBandMotion
        title="Ready when you are"
        description="Install the first section and see how it sits in your own theme."
        actions={ACTIONS}
        note="No account required."
        spacing="none"
      />
      <CtaBandMotion
        variant="primary"
        layout="split"
        title="Or start from a template"
        description="Whole pages, assembled from the same sections."
        actions={[{ label: "Browse templates", href: "#templates" }]}
        spacing="none"
      />
    </div>
  )
}
