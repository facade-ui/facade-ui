import { Steps } from "@registry/sections/steps"

import { STEPS } from "./content"

export function Demo() {
  return (
    <Steps
      eyebrow="Getting started"
      title="From nothing to a landing page"
      description="An ordered list, so a screen reader already announces 'step 2 of 3' without the numeral being read twice."
      items={STEPS}
    />
  )
}
