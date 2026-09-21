import { CtaBand } from "@registry/sections/cta-band"

import { ACTIONS } from "./content"

export function Demo() {
  return (
    <div className="flex flex-col gap-10">
      <CtaBand
        title="Ready when you are"
        description="Install the first section and see how it sits in your own theme."
        actions={ACTIONS}
        note="No account required."
        spacing="none"
      />
      <CtaBand
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
