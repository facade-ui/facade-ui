"use client"

/**
 * The `logo-cloud` demo, with the motion variant swapped in.
 *
 * Identical props: the motion variant only changes which slot components
 * the static section renders through.
 *
 * `"use client"` is required here, not incidental: the motion variant is a
 * client component, and icon components cannot cross a server-to-client
 * boundary as props. See the note on `IconComponent`.
 */

import { LogoCloudMotion } from "@registry/sections/logo-cloud-motion"

import { LOGOS } from "./content"

export function Demo() {
  return (
    <LogoCloudMotion
      title="Trusted by teams shipping every day"
      items={LOGOS}
      showNames
    />
  )
}
