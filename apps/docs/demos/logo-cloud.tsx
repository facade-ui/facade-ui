import { LogoCloud } from "@registry/sections/logo-cloud"

import { LOGOS } from "./content"

export function Demo() {
  return <LogoCloud title="Trusted by teams shipping every day" items={LOGOS} showNames />
}
