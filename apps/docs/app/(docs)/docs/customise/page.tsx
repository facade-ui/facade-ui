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
        Open the customiser with the palette button in the header, on any page. It floats
        over the corner of the page rather than beside it, and there is no preview pane,
        because the site itself is the preview: the chrome, the sections and the component
        previews all restyle as you choose.
      </p>
      <p>
        It starts with three choices. A <strong>brand colour</strong> — any of
        Tailwind&apos;s seventeen, or your own as a hex. A <strong>neutral</strong> —
        stone, neutral, zinc, gray or slate. And how round the <strong>corners</strong>{" "}
        are. The first two generate the whole palette, light and dark, the way the default
        theme was generated from orange and stone: Tailwind&apos;s steps where they pass,
        walked darker or lighter where they do not. Whatever you pick, the result clears
        every check below. A bright brand gets an ink label on its buttons and a dark one
        gets white, because that is decided by measuring rather than by habit.
      </p>
      <p>
        <strong>Advanced</strong> opens every token, one at a time, as a hex and as OKLCH.
        OKLCH is there on purpose: lightness is the axis contrast actually depends on, so
        changing <strong>L</strong> moves the ratio predictably, where nudging a hex value
        is guesswork. This is the level where a palette can stop passing, so it is scored
        live against the same pairs and thresholds that{" "}
        <code>scripts/check-contrast.ts</code> enforces on every commit — a theme that
        shows all-green is one the build would accept.
      </p>
      <p>
        The theme is kept in your browser and applies as one more preset,{" "}
        <strong>Custom</strong>. Switch the preset select in the header to any of the
        shipped palettes at any point; yours is still there when you return, until you
        press Reset.
      </p>

      <ThemeCustomiserExport />
    </Prose>
  )
}
