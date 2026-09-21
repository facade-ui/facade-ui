import { UspList } from "@registry/sections/usp-list"

import { USPS } from "./content"

export function Demo() {
  return (
    <UspList
      eyebrow="Why"
      title="Three things that matter"
      description="Code quality, accessibility and composability are the product."
      items={USPS}
    />
  )
}
