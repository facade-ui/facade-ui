import type { Metadata } from "next"

import { Prose } from "@/components/prose"
import { ThemeCustomiserExport } from "@/components/theme-customiser-export"

export const metadata: Metadata = {
  title: "Theme customiser",
  description:
    "Build a Facade UI theme from a brand colour and a neutral, fine-tune any token in OKLCH, see it scored against the same contrast checks CI enforces, and export the CSS.",
}

export default function CustomisePage() {
  return (
    <Prose className="max-w-none">
      <h1 className="text-display-sm font-semibold">Theme customiser</h1>
      <p>
        Open the customiser with the palette button in the header, on any page. There is
        no preview pane: the whole site restyles as you choose.
      </p>
      <p>
        It starts with three choices: a <strong>brand colour</strong> (any Tailwind
        colour, or your own hex), a <strong>neutral</strong>, and how round the{" "}
        <strong>corners</strong> are. The first two generate the whole palette, light and
        dark, and the result always passes the contrast checks below.
      </p>
      <p>
        <strong>Advanced</strong> opens every token as a hex and as OKLCH. This is the
        level where a palette can stop passing, so it is scored live against the same
        pairs and thresholds <code>scripts/check-contrast.ts</code> enforces in CI.
      </p>
      <p>
        The theme is kept in your browser and applies as one more preset,{" "}
        <strong>Custom</strong>, until you press Reset.
      </p>

      <ThemeCustomiserExport />
    </Prose>
  )
}
