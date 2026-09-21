"use client"

/**
 * The `card-list` demo, with the motion variant swapped in.
 *
 * Identical props: the motion variant only changes which slot components
 * the static section renders through.
 *
 * `"use client"` is required here, not incidental: the motion variant is a
 * client component, and icon components cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { CardListMotion } from "@registry/sections/card-list-motion"

import { POSTS } from "./content"

export function Demo() {
  return (
    <CardListMotion
      eyebrow="Blog"
      title="Latest writing"
      description="Cards use a stretched link, so the accessible name is the title rather than the whole card."
      items={POSTS}
    />
  )
}
