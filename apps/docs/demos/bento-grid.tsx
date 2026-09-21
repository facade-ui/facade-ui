import { BentoGrid } from "@registry/sections/bento-grid"

import { BENTO } from "./content"

export function Demo() {
  return (
    <BentoGrid
      eyebrow="At a glance"
      title="A mosaic that still reads in order"
      description="Tiles are laid out in the order they are given — no dense packing, so reading order matches what you see."
      items={BENTO}
    />
  )
}
