import { CardList } from "@registry/sections/card-list"

import { POSTS } from "./content"

export function Demo() {
  return (
    <CardList
      eyebrow="Blog"
      title="Latest writing"
      description="Cards use a stretched link, so the accessible name is the title rather than the whole card."
      items={POSTS}
    />
  )
}
