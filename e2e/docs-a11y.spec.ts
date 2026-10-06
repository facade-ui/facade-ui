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

import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

import { readScopes } from "../scripts/lib/css-tokens.ts"

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]

const PAGES = [
  "/",
  "/components",
  "/templates",
  "/templates/saas-landing",
  "/templates/changelog",
  "/docs/installation",
  "/docs/theming",
  "/docs/customise",
  "/docs/accessibility",
  "/docs/agents",
  // One item page, which exercises the props table, code blocks and preview frame.
  "/components/feature-grid",
  // A motion item, which additionally renders the Replay control.
  "/components/motion-primitives",
]

/** The shipped neutral palette, as OKLCH source values, to put in storage. */
const NEUTRAL = readScopes().find(
  (scope) => scope.preset === "neutral" && scope.mode === "light",
)!.tokens

/** Tailwind's scales as the build extracted them, so no step is copied here. */
const tailwind = JSON.parse(
  readFileSync(
    resolve(import.meta.dirname, "../apps/docs/.generated/tailwind-colors.json"),
    "utf8",
  ),
) as Record<"brand" | "neutral", Record<string, Record<string, string>>>

/** A custom property's computed value on `<html>`. */
const token = (page: Page, name: string) =>
  page.evaluate(
    (property) =>
      getComputedStyle(document.documentElement).getPropertyValue(property).trim(),
    name,
  )

const scan = async (page: Page) => {
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

test("a phone-width header keeps to the essentials", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" })
  await page.setViewportSize({ width: 390, height: 780 })
  await page.goto("/components/feature-grid")

  const header = page.getByRole("banner")

  // Three segments become one button, whose name states the mode and the next.
  await expect(header.getByRole("radio", { name: "Light" })).toBeHidden()
  const mode = header.getByRole("button", { name: /^Colour mode/ })
  await expect(mode).toHaveAccessibleName("Colour mode: System. Switch to Light")
  await expect(page.locator("html")).not.toHaveClass(/dark/)

  await mode.click()
  await expect(mode).toHaveAccessibleName("Colour mode: Light. Switch to Dark")
  await mode.click()
  await expect(mode).toHaveAccessibleName("Colour mode: Dark. Switch to System")
  await expect(page.locator("html")).toHaveClass(/dark/)
  // Also announced: a label changing under focus is not read out everywhere.
  await expect(header.getByText("Dark colour mode")).toBeAttached()
  await mode.click()
  await expect(mode).toHaveAccessibleName("Colour mode: System. Switch to Light")
  await expect(page.locator("html")).not.toHaveClass(/dark/)

  // The GitHub link is in exactly one place: the drawer, wherever there is one.
  await expect(header.getByRole("link", { name: /GitHub/ })).toBeHidden()
  await page.getByRole("button", { name: "Open navigation" }).click()
  await expect(
    page.getByRole("dialog").getByRole("link", { name: "GitHub (opens in a new tab)" }),
  ).toBeVisible()

  // And nothing in the row pushes the page sideways.
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true)
})

test("a desktop header has the full controls and the GitHub link", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/components/feature-grid")

  const header = page.getByRole("banner")
  await expect(header.getByRole("radio", { name: "System" })).toBeChecked()
  await expect(header.getByRole("button", { name: /^Colour mode/ })).toBeHidden()
  await expect(header.getByRole("link", { name: /GitHub/ })).toBeVisible()
})

test("the docs navigation drawer has no axe violations while open", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 390, height: 780 })
  await page.goto("/components/feature-grid")

  await page.getByRole("button", { name: "Open navigation" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()

  expect(await scan(page)).toEqual([])
})

test("the customiser's basic mode themes the whole site without moving it", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/components/feature-grid")

  const before = await page.locator("main#main").boundingBox()

  await page.getByRole("button", { name: "Customise theme" }).click()
  const panel = page.getByRole("dialog", { name: "Customise theme" })
  await expect(panel).toBeVisible()

  // The panel floats: opening it must not reflow the page.
  expect(await page.locator("main#main").boundingBox()).toEqual(before)

  // Basic mode starts on the default recipe, with every token one click away.
  await expect(panel.getByRole("radio", { name: "Orange" })).toBeChecked()
  await expect(panel.getByRole("radio", { name: "Stone" })).toBeChecked()
  await expect(panel.getByRole("radio", { name: "Medium" })).toBeChecked()
  await expect(panel.getByRole("textbox", { name: "Primary hex" })).toBeHidden()

  // One swatch regenerates the palette, and the generated rules win the cascade.
  await panel.getByTitle("Blue", { exact: true }).click()
  await expect(page.locator("html")).toHaveAttribute("data-facade-theme", "custom")
  await expect.poll(() => token(page, "--primary")).toBe(tailwind.brand.blue!["600"])
  // Blue is dark enough for a light label; orange was not, and had ink.
  await expect
    .poll(() => token(page, "--primary-foreground"))
    .toBe(tailwind.neutral.stone!["50"])

  // The neutral is the other half of the recipe, and keeps the brand.
  await panel.getByText("Slate", { exact: true }).click()
  await expect
    .poll(() => token(page, "--foreground"))
    .toBe(tailwind.neutral.slate!["950"])
  await expect.poll(() => token(page, "--primary")).toBe(tailwind.brand.blue!["600"])

  await panel.getByText("Large", { exact: true }).click()
  await expect.poll(() => token(page, "--radius")).toBe("1rem")

  // Basic mode cannot produce a palette CI would reject.
  await expect(panel.getByText("All contrast checks pass")).toBeVisible()

  // The preview iframe is a separate document; it follows through storage.
  await expect
    .poll(() =>
      page.frameLocator("iframe").locator("html").getAttribute("data-facade-theme"),
    )
    .toBe("custom")

  // Any colour can be the brand; this green clears 3:1, so it is the primary.
  await panel.getByRole("textbox", { name: "Custom", exact: true }).fill("#0f7b4f")
  await expect
    .poll(() => token(page, "--primary"))
    .toMatch(/^oklch\(0\.5\d+ 0\.1\d+ 1[56]\d/)
  await expect(panel.getByText("All contrast checks pass")).toBeVisible()

  // Non-modal: the page stays usable, and neither an outside click nor tabbing
  // out of the panel dismisses it.
  const sidebar = page.getByRole("navigation", { name: "Documentation" })
  await sidebar.getByRole("link", { name: "Bento grid" }).click()
  await expect(page).toHaveURL(/\/components\/bento-grid$/)
  await expect(panel).toBeVisible()

  await panel.getByRole("button", { name: "Close customiser" }).focus()
  await page.keyboard.press("Tab")
  await expect(panel).toBeVisible()

  expect(await scan(page)).toEqual([])

  // Reset clears the stored palette and the preset.
  await panel.getByRole("button", { name: "Reset" }).click()
  await expect(page.locator("html")).not.toHaveAttribute("data-facade-theme", "custom")
  await expect(page.locator("#facade-custom-theme")).toHaveCount(0)
  expect(
    await page.evaluate(() => localStorage.getItem("facade-docs-custom-theme")),
  ).toBeNull()
  await expect.poll(() => token(page, "--radius")).toMatch(/^0?\.625rem$/)
  await expect(panel.getByRole("radio", { name: "Orange" })).toBeChecked()
  await expect(panel.getByRole("button", { name: "Reset" })).toBeHidden()
})

test("the customiser's advanced mode edits one token at a time", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/components/feature-grid")

  await page.getByRole("button", { name: "Customise theme" }).click()
  const panel = page.getByRole("dialog", { name: "Customise theme" })

  const advanced = panel.getByRole("button", { name: /Advanced/ })
  await expect(advanced).toHaveAttribute("aria-expanded", "false")
  await advanced.click()
  await expect(advanced).toHaveAttribute("aria-expanded", "true")

  const primary = () => token(page, "--primary")

  // Every field is named for its token and what it edits, because sixty
  // controls called "L" are sixty controls nobody can tell apart.
  await panel.getByRole("spinbutton", { name: "Primary lightness" }).fill("0.6")
  await expect(page.locator("html")).toHaveAttribute("data-facade-theme", "custom")
  await expect
    .poll(primary)
    .toBe(tailwind.brand.orange!["600"]!.replace(/^oklch\(\S+/, "oklch(0.6"))

  // A hand-edited palette is no longer a recipe, so no swatch claims it.
  await expect(panel.getByRole("radio", { name: "Orange" })).not.toBeChecked()
  await expect(panel.getByRole("radio", { name: "Stone" })).not.toBeChecked()

  // Hex and OKLCH edit the same colour, so a pasted brand hex has to land
  // exactly — which it only does if the sRGB transfer function is applied on
  // the way out and the stored value keeps enough precision to come back.
  const hex = panel.getByRole("textbox", { name: "Primary hex" })
  await hex.fill("#e7000b")
  await expect.poll(primary).toMatch(/^oklch\(0\.5[78]/)
  // Tab to the next field rather than blurring to nothing: leaving the panel
  // entirely is what a real user does with a click, and Base UI parks the
  // panel's tab order while focus is away.
  await page.keyboard.press("Tab")
  await expect(hex).toHaveValue("#e7000b")
  await expect(panel.getByRole("spinbutton", { name: "Primary lightness" })).toBeFocused()

  // Advanced can fail, and says so: ink on that red is 4.1:1.
  await expect(panel.getByText("1 contrast check fails")).toBeVisible()
  await expect(panel.getByText("Primary button label")).toBeVisible()

  expect(await scan(page)).toEqual([])
})

test("the customiser survives a reload and keeps the panel readable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/components/feature-grid")

  // A palette with no contrast at all: the site becomes unreadable on purpose.
  await page.evaluate((neutral) => {
    const broken = { ...neutral, "--foreground": "oklch(1 0 0)" }
    localStorage.setItem(
      "facade-docs-custom-theme",
      JSON.stringify({ light: broken, dark: broken }),
    )
    localStorage.setItem("facade-docs-preset", "custom")
    localStorage.setItem("facade-docs-mode", "light")
  }, NEUTRAL)
  await page.reload()

  // Restored before paint, by the inline script rather than by hydration.
  await expect(page.locator("html")).toHaveAttribute("data-facade-theme", "custom")
  expect(await token(page, "--foreground")).toBe("oklch(1 0 0)")

  await page.getByRole("button", { name: "Customise theme" }).click()
  const panel = page.getByRole("dialog", { name: "Customise theme" })

  // The tool pins its own colours to the shipped palette: editing a broken
  // theme must not break the tool you are using to fix it.
  expect(
    await panel.evaluate((el) =>
      getComputedStyle(el).getPropertyValue("--foreground").trim(),
    ),
  ).toBe(tailwind.neutral.stone!["950"])
  await expect(panel.getByText(/contrast check/)).toBeVisible()

  // One click back to a palette CI already guarantees.
  await panel.getByRole("button", { name: /Advanced/ }).click()
  await panel.getByRole("button", { name: "neutral" }).click()
  await expect.poll(() => token(page, "--foreground")).toBe(NEUTRAL["--foreground"])
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

test("a tampered radius is dropped and the palette beside it still applies", async ({
  page,
}) => {
  await page.goto("/components/feature-grid")

  // The radius reaches the same stylesheet, so it must be one of the listed values.
  await page.evaluate((palette) => {
    localStorage.setItem(
      "facade-docs-custom-theme",
      JSON.stringify({
        light: { ...palette, "--primary": "oklch(0.5 0.2 260)" },
        dark: palette,
        radius: "1rem;} body{display:none",
      }),
    )
    localStorage.setItem("facade-docs-preset", "custom")
    localStorage.setItem("facade-docs-mode", "light")
  }, NEUTRAL)
  await page.reload()

  await expect(page.locator("html")).toHaveAttribute("data-facade-theme", "custom")
  await expect(page.locator("body")).toBeVisible()
  expect(await page.locator("#facade-custom-theme").textContent()).not.toContain(
    "display",
  )
  expect(await token(page, "--primary")).toBe("oklch(0.5 0.2 260)")
  // The shipped radius, as the production build minifies it.
  expect(await token(page, "--radius")).toMatch(/^0?\.625rem$/)
})

test("the customiser panel is reachable and scrollable from the keyboard", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto("/components/feature-grid")

  const trigger = page.getByRole("button", { name: "Customise theme" })
  await trigger.click()
  const panel = page.getByRole("dialog", { name: "Customise theme" })

  // Base UI takes a non-modal popup out of the tab order while focus is
  // elsewhere, so the guarantee that matters is that the trigger leads back in.
  await page
    .getByRole("navigation", { name: "Documentation" })
    .getByRole("link", { name: "Installation" })
    .focus()
  await trigger.focus()
  await page.keyboard.press("Tab")
  await expect(panel.getByRole("button", { name: "Close customiser" })).toBeFocused()

  // And from there every control is a tab stop, which is what makes the
  // scrolling panel keyboard-operable at all. A radio group is one stop.
  await page.keyboard.press("Tab")
  await expect(panel.getByRole("radio", { name: "Orange" })).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(panel.getByRole("radio", { name: "Amber" })).toBeChecked()
})
