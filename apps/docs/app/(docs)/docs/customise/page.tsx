import type { Metadata } from "next"

import { Prose } from "@/components/prose"
import { ThemeCustomiser } from "@/components/theme-customiser"

export const metadata: Metadata = {
  title: "Theme customiser",
  description:
    "Edit a Facade UI palette in OKLCH, see it scored against the same contrast checks CI enforces, and export the CSS.",
}

export default function CustomisePage() {
  return (
    <Prose className="max-w-none">
      <h1 className="text-display-sm font-semibold">Theme customiser</h1>
      <p>
        Start from one of the three presets, adjust it, and export the CSS. The palette is
        scored live against the same pairs and thresholds that{" "}
        <code>scripts/check-contrast.ts</code> enforces on every commit — so a theme that
        shows all-green here is one the build would accept.
      </p>
      <p>
        Colours are edited in OKLCH on purpose. Lightness is the axis contrast actually
        depends on, so dragging <strong>L</strong> moves the ratio predictably, where
        nudging a hex value is guesswork.
      </p>

      <ThemeCustomiser />
    </Prose>
  )
}
