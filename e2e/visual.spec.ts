/**
 * Visual regression snapshots at the three breakpoints the docs expose.
 *
 * Animations are disabled and reduced motion is emulated, so a snapshot captures
 * the settled state rather than whatever frame the screenshot happened to catch.
 */

import { expect, test } from "@playwright/test"

import { BREAKPOINTS, PREVIEW_ITEMS } from "./items"

for (const item of PREVIEW_ITEMS) {
  test.describe(item, () => {
    for (const breakpoint of BREAKPOINTS) {
      for (const mode of ["light", "dark"] as const) {
        test(`looks right at ${breakpoint.name} — ${mode}`, async ({ page }) => {
          await page.emulateMedia({ reducedMotion: "reduce" })
          await page.setViewportSize({
            width: breakpoint.width,
            height: breakpoint.height,
          })
          await page.goto(`/preview/${item}`)
          await page.evaluate(
            (dark) => {
              document.documentElement.classList.toggle("dark", dark === "true")
            },
            String(mode === "dark"),
          )

          await page.waitForTimeout(400)

          await expect(page).toHaveScreenshot(`${item}-${breakpoint.name}-${mode}.png`, {
            fullPage: true,
          })
        })
      }
    }
  })
}
