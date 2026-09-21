"use client"

/**
 * The `team` demo, with the motion variant swapped in.
 *
 * Identical props: the motion variant only changes which slot components
 * the static section renders through.
 *
 * `"use client"` is required here, not incidental: the motion variant is a
 * client component, and icon components cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { TeamMotion } from "@registry/sections/team-motion"

import { TEAM } from "./content"

export function Demo() {
  return (
    <TeamMotion
      eyebrow="Team"
      title="Who builds this"
      description="Social links are named per person, so a links list does not show three identical 'LinkedIn' entries."
      items={TEAM}
      shape="circle"
    />
  )
}
