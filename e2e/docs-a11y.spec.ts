/**
 * axe over the docs site itself, not just the component previews.
 *
 * The previews are scanned in isolation on purpose, so a violation in the
 * chrome cannot mask or manufacture one in a section. That leaves the chrome
 * unscanned — which matters, because the docs site is the largest consumer of
 * Facade UI and the first thing anyone judges it by.
 *
 * The mobile drawer is opened explicitly: a focus-trapped dialog is exactly the
 * kind of thing that passes when closed and fails when open.
 */

import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]

const PAGES = [
  "/",
  "/components",
  "/docs/installation",
  "/docs/theming",
  "/docs/accessibility",
  // One item page, which exercises the props table, code blocks and preview frame.
  "/components/feature-grid",
]

const scan = async (page: import("@playwright/test").Page) => {
  const results = await new AxeBuilder({ page })
    .withTags(TAGS)
    // The preview iframe has its own dedicated scan in a11y.spec.ts.
    .exclude("iframe")
    .analyze()
  return results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.map((node) => node.target.join(" ")),
  }))
}

for (const path of PAGES) {
  for (const mode of ["light", "dark"] as const) {
    test(`docs page ${path} has no axe violations — ${mode}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" })
      await page.goto(path)
      await page.evaluate(
        (dark) => {
          document.documentElement.classList.toggle("dark", dark === "true")
        },
        String(mode === "dark"),
      )
      await page.waitForTimeout(300)

      expect(await scan(page)).toEqual([])
    })
  }
}

test("the docs navigation drawer has no axe violations while open", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 390, height: 780 })
  await page.goto("/components/feature-grid")

  await page.getByRole("button", { name: "Open navigation" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()

  expect(await scan(page)).toEqual([])
})
