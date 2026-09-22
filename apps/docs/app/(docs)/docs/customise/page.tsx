import type { Metadata } from "next"

import { Prose } from "@/components/prose"
import { ThemeCustomiserExport } from "@/components/theme-customiser-export"

export const metadata: Metadata = {
  title: "Theme customiser",
  description:
    "Edit a Facade UI palette in OKLCH from any page, see it scored against the same contrast checks CI enforces, and export the CSS.",
}

export default function CustomisePage() {
  return (
    <Prose className="max-w-none">
      <h1 className="text-display-sm font-semibold">Theme customiser</h1>
      <p>
        Open the customiser with the palette button in the header, on any page. Start from
        one of the three presets and adjust it: there is no preview pane, because the site
        itself is the preview. The chrome, the sections and the component previews all
        recolour as you drag.
      </p>
      <p>
        Colours are edited in OKLCH on purpose. Lightness is the axis contrast actually
        depends on, so dragging <strong>L</strong> moves the ratio predictably, where
        nudging a hex value is guesswork. Your palette is scored live against the same
        pairs and thresholds that <code>scripts/check-contrast.ts</code> enforces on every
        commit — so a theme that shows all-green is one the build would accept.
      </p>
      <p>
        The palette is kept in your browser and applies as a fourth theme preset,{" "}
        <strong>Custom</strong>. Switch the preset select in the header back to neutral,
        warm or vivid at any point; your palette is still there when you return.
      </p>

      <ThemeCustomiserExport />
    </Prose>
  )
}
