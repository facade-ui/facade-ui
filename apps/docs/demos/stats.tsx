import { Stats } from "@registry/sections/stats"

import { STATS } from "./content"

export function Demo() {
  return (
    <Stats
      eyebrow="By the numbers"
      title="What the checks actually cover"
      items={STATS}
      variant="card"
    />
  )
}
