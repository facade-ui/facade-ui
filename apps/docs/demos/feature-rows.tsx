import { FeatureRows } from "@registry/sections/feature-rows"

import { ROWS } from "./content"

export function Demo() {
  return (
    <FeatureRows
      eyebrow="How it works"
      title="Install a piece, own the source"
      items={ROWS}
      align="center"
    />
  )
}
