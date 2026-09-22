/**
 * axe over the docs site itself, not just the component previews.
 *
 * The previews are scanned in isolation on purpose, so a violation in the
 * chrome cannot mask or manufacture one in a section. That leaves the chrome
 * unscanned — which matters, because the docs site is the largest consumer of
 * Facade UI and the first thing anyone judges it by.
 *
 * The mobile drawer and the customiser panel are opened explicitly: a dialog is
 * exactly the kind of thing that passes when closed and fails when open.
 */

import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]

const PAGES = [
  "/",
  "/components",
  "/docs/installation",
  "/docs/theming",
  "/docs/customise",
  "/docs/accessibility",
  // One item page, which exercises the props table, code blocks and preview frame.
  "/components/feature-grid",
  // A motion item, which additionally renders the Replay control.
  "/components/motion-primitives",
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

test("the sidebar's collapsed groups are still reachable and labelled", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/components/motion-primitives")

  const sidebar = page.getByRole("navigation", { name: "Documentation" })

  // Closed by default, so the catalogue does not arrive as one wall.
  const templates = sidebar.getByRole("button", { name: "Templates" })
  await expect(templates).toHaveAttribute("aria-expanded", "false")

  // Except the group holding the current page, which opens on load.
  await expect(sidebar.getByRole("button", { name: "Motion" })).toHaveAttribute(
    "aria-expanded",
    "true",
  )

  await templates.click()
  await expect(templates).toHaveAttribute("aria-expanded", "true")
  await expect(sidebar.getByRole("link", { name: "SaaS landing page" })).toBeVisible()

  expect(await scan(page)).toEqual([])
})

test("replaying a motion preview reloads the frame and keeps it labelled", async ({
  page,
}) => {
  await page.goto("/components/motion-primitives")

  const frame = page.locator("iframe")
  await expect(frame).toHaveAttribute("src", "/preview/motion-primitives")

  await page.getByRole("button", { name: "Replay" }).click()
  await expect(frame).toHaveAttribute("src", /\/preview\/motion-primitives\?replay=1/)

  // The shareable link must not pick up the transient replay counter.
  await expect(page.getByRole("link", { name: /Open full width/ })).toHaveAttribute(
    "href",
    "/preview/motion-primitives",
  )
})

test("the docs navigation drawer has no axe violations while open", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 390, height: 780 })
  await page.goto("/components/feature-grid")

  await page.getByRole("button", { name: "Open navigation" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()

  expect(await scan(page)).toEqual([])
})

test("the customiser panel themes the whole site without covering it", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/components/feature-grid")

  await page.getByRole("button", { name: "Customise theme" }).click()
  const panel = page.getByRole("dialog", { name: "Customise theme" })
  await expect(panel).toBeVisible()

  // Every slider is named for its token and channel, because nineteen controls
  // called "L" are nineteen controls nobody can tell apart.
  const lightness = panel.getByRole("slider", { name: "Primary lightness" })
  await lightness.fill("0.6")

  // The computed value, not the <style> element's text: what is being checked
  // is that the generated rules actually win the cascade.
  await expect(page.locator("html")).toHaveAttribute("data-facade-theme", "custom")
  await expect
    .poll(() =>
      page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue("--primary").trim(),
      ),
    )
    .toBe("oklch(0.6 0 0)")

  // The preview iframe is a separate document; it follows through storage.
  await expect
    .poll(() =>
      page.frameLocator("iframe").locator("html").getAttribute("data-facade-theme"),
    )
    .toBe("custom")

  // Non-modal: the page stays usable, and neither an outside click nor tabbing
  // out of the panel dismisses it.
  const sidebar = page.getByRole("navigation", { name: "Documentation" })
  await sidebar.getByRole("link", { name: "Bento grid" }).click()
  await expect(page).toHaveURL(/\/components\/bento-grid$/)
  await expect(panel).toBeVisible()

  await panel.getByRole("button", { name: "Close customiser" }).focus()
  await page.keyboard.press("Tab")
  await expect(panel).toBeVisible()

  // And the reserved gutter means the page it is theming is never underneath it.
  const main = await page.locator("main#main").boundingBox()
  const popup = await panel.boundingBox()
  expect(main!.x + main!.width).toBeLessThanOrEqual(popup!.x)

  expect(await scan(page)).toEqual([])
})

test("the customiser survives a reload and keeps the panel readable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/components/feature-grid")

  // A palette with no contrast at all: the site becomes unreadable on purpose.
  await page.evaluate(() => {
    const neutral = {
      "--background": "oklch(1 0 0)",
      "--foreground": "oklch(0.145 0 0)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.145 0 0)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.145 0 0)",
      "--primary": "oklch(0.205 0 0)",
      "--primary-foreground": "oklch(0.985 0 0)",
      "--secondary": "oklch(0.97 0 0)",
      "--secondary-foreground": "oklch(0.205 0 0)",
      "--muted": "oklch(0.97 0 0)",
      "--muted-foreground": "oklch(0.505 0 0)",
      "--accent": "oklch(0.97 0 0)",
      "--accent-foreground": "oklch(0.205 0 0)",
      "--destructive": "oklch(0.577 0.245 27.325)",
      "--destructive-foreground": "oklch(0.985 0 0)",
      "--border": "oklch(0.922 0 0)",
      "--input": "oklch(0.708 0 0)",
      "--ring": "oklch(0.708 0 0)",
    }
    const broken = { ...neutral, "--foreground": "oklch(1 0 0)" }
    localStorage.setItem(
      "facade-docs-custom-theme",
      JSON.stringify({ light: broken, dark: broken }),
    )
    localStorage.setItem("facade-docs-preset", "custom")
    localStorage.setItem("facade-docs-mode", "light")
  })
  await page.reload()

  // Restored before paint, by the inline script rather than by hydration.
  await expect(page.locator("html")).toHaveAttribute("data-facade-theme", "custom")
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--foreground").trim(),
    ),
  ).toBe("oklch(1 0 0)")

  await page.getByRole("button", { name: "Customise theme" }).click()
  const panel = page.getByRole("dialog", { name: "Customise theme" })

  // The tool pins its own colours to the shipped palette: editing a broken
  // theme must not break the tool you are using to fix it.
  expect(
    await panel.evaluate((el) =>
      getComputedStyle(el).getPropertyValue("--foreground").trim(),
    ),
  ).toBe("oklch(0.145 0 0)")
  await expect(panel.getByText(/contrast check/)).toBeVisible()

  // One click back to a palette CI already guarantees.
  await panel.getByRole("button", { name: "neutral" }).click()
  await expect
    .poll(() =>
      page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue("--foreground")
          .trim(),
      ),
    )
    .toBe("oklch(0.145 0 0)")
  await expect(panel.getByText("All contrast checks pass")).toBeVisible()
})

test("the customiser panel has no axe violations as a bottom sheet", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 800, height: 700 })
  await page.goto("/components/feature-grid")

  await page.getByRole("button", { name: "Customise theme" }).click()
  await expect(page.getByRole("dialog", { name: "Customise theme" })).toBeVisible()

  expect(await scan(page)).toEqual([])
})

test("a tampered custom theme is ignored rather than applied", async ({ page }) => {
  await page.goto("/components/feature-grid")

  // The pre-paint script writes a stylesheet from storage, so storage is an
  // injection surface. A value that is not plain OKLCH must reach nothing.
  await page.evaluate(() => {
    localStorage.setItem(
      "facade-docs-custom-theme",
      JSON.stringify({
        light: { "--background": "red;} body{display:none" },
        dark: {},
      }),
    )
    localStorage.setItem("facade-docs-preset", "custom")
  })
  await page.reload()

  await expect(page.locator("html")).not.toHaveAttribute("data-facade-theme", "custom")
  expect(await page.locator("#facade-custom-theme").count()).toBe(0)
  await expect(page.locator("body")).toBeVisible()
})
