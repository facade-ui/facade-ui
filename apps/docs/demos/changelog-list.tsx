import { ChangelogList } from "@registry/sections/changelog-list"

import { RELEASES } from "./content"

export function Demo() {
  return (
    <ChangelogList
      eyebrow="Changelog"
      title="What shipped"
      description="Every release, newest first."
      items={RELEASES}
    />
  )
}
