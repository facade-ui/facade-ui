/**
 * axe-core scan of every registry preview, in light and dark, across all three
 * theme presets.
 *
 * Six theme scopes rather than two: a contrast regression usually shows up in
 * one preset only, and scanning just the default would let the other two rot.
 * The colour-contrast rule is the reason this runs against a real browser at all
 * — it needs computed styles, which jsdom cannot give.
 *
 * Zero violations is the bar. Automated scanning catches roughly a third of real
 * accessibility problems; the keyboard walkthroughs cover what it cannot.
 */

import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

import { PREVIEW_ITEMS } from "./items"

const PRESETS = ["neutral", "warm", "vivid"] as const
const MODES = ["light", "dark"] as const

/** WCAG 2.2 AA, plus the best-practice rules that catch real structural slips. */
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]

for (const item of PREVIEW_ITEMS) {
  test.describe(item, () => {
    for (const mode of MODES) {
      for (const preset of PRESETS) {
        test(`has no axe violations — ${mode}, ${preset}`, async ({ page }) => {
          await page.emulateMedia({ reducedMotion: "reduce" })
          await page.goto(`/preview/${item}`)

          await page.evaluate(
            ([dark, themePreset]) => {
              document.documentElement.classList.toggle("dark", dark === "true")
              if (themePreset === "neutral") {
                document.documentElement.removeAttribute("data-facade-theme")
              } else {
                document.documentElement.setAttribute("data-facade-theme", themePreset!)
              }
            },
            [String(mode === "dark"), preset],
          )

          // Motion primitives start at opacity 0; wait for the entrance to settle
          // so axe measures the colours a visitor actually sees.
          await page.waitForTimeout(400)

          const results = await new AxeBuilder({ page }).withTags(TAGS).analyze()

          expect(
            results.violations.map((violation) => ({
              id: violation.id,
              impact: violation.impact,
              help: violation.help,
              nodes: violation.nodes.map((node) => node.target.join(" ")),
            })),
          ).toEqual([])
        })
      }
    }
  })
}
