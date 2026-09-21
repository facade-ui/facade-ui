/**
 * Visual regression snapshots at the three breakpoints the docs expose.
 *
 * Animations are disabled and reduced motion is emulated, so a snapshot captures
 * the settled state rather than whatever frame the screenshot happened to catch.
 *
 * Sections are captured full-page; templates are captured at viewport height.
 * A template is composition over sections that are each already snapshotted on
 * their own, so a full-page capture of one is mostly re-photographing covered
 * ground — at 4,000 to 6,500 px tall, half a megabyte per baseline, and a diff
 * nobody can read in a report. The viewport capture still catches the thing only
 * a template can break: how the pieces meet at the top of the page.
 *
 * The trade-off is real and worth stating: a regression that appears *only* in a
 * template, *only* below the fold, will not be caught here. Given every section
 * in that page is snapshotted at all three widths already, that is a narrow gap.
 */

import { expect, test } from "@playwright/test"

import { BREAKPOINTS, PREVIEW_ITEMS, TEMPLATE_ITEMS } from "./items"

for (const item of PREVIEW_ITEMS) {
  const fullPage = !TEMPLATE_ITEMS.has(item)

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
            fullPage,
          })
        })
      }
    }
  })
}
