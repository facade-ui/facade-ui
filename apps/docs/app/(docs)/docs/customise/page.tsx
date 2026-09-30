import type { Metadata } from "next"

import { Prose } from "@/components/prose"
import { ThemeCustomiserExport } from "@/components/theme-customiser-export"

export const metadata: Metadata = {
  title: "Theme customiser",
  description:
    "Build a Facade UI theme from a brand colour and a neutral, adjust any colour, check its contrast, and copy the CSS.",
}

export default function CustomisePage() {
  return (
    <Prose className="max-w-none">
      <h1 className="text-display-sm font-semibold">Theme customiser</h1>
      <p>
        To open the customiser, select the palette button in the header. It works on any
        page. The whole site changes as you choose, so there is no separate preview.
      </p>
      <p>Start with three choices:</p>
      <ul>
        <li>
          <strong>Brand colour</strong>: any Tailwind colour, or your own hex code.
        </li>
        <li>
          <strong>Neutral</strong>: the grey used for backgrounds, borders and text.
        </li>
        <li>
          <strong>Corners</strong>: how round they are.
        </li>
      </ul>
      <p>
        The brand colour and the neutral generate every colour for light and dark mode.
        The result always passes the contrast checks below.
      </p>
      <p>
        <strong>Advanced</strong> shows every colour token as a hex code and as OKLCH
        values. When you edit tokens by hand, a colour pair can fail, so the customiser
        checks your theme as you type. It uses the same colour pairs and minimum ratios as{" "}
        <code>scripts/check-contrast.ts</code>, the script that tests this project.
      </p>
      <p>
        Your theme is saved in your browser. It appears as one more preset,{" "}
        <strong>Custom</strong>, until you select Reset.
      </p>

      <ThemeCustomiserExport />
    </Prose>
  )
}
