import { Team } from "@registry/sections/team"

import { TEAM } from "./content"

export function Demo() {
  return (
    <Team
      eyebrow="Team"
      title="Who builds this"
      description="Social links are named per person, so a links list does not show three identical 'LinkedIn' entries."
      items={TEAM}
      shape="circle"
    />
  )
}
