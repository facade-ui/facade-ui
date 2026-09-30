"use client"

/**
 * The custom theme: a palette the reader edits, applied to the whole docs site.
 *
 * The trick is that it is not a new theming mechanism at all. The site is
 * already themed by `data-facade-theme` on `<html>`, so a custom palette is
 * simply a **fourth preset** whose stylesheet happens to be generated at
 * runtime instead of shipping in `themes.css`. Everything that already follows
 * the attribute — the chrome, the preview iframes, a preview opened full width
 * in its own tab — follows the custom theme for free.
 *
 * The palette lives in localStorage, so every same-origin document sees it: the
 * `storage` event is what carries an edit into the iframes and the other tabs.
 *
 * Anything unparseable in storage degrades to "no custom theme" rather than
 * throwing, because storage is shared with older builds and with the reader.
 */

import { parseOklch } from "./oklch"
import { parseRecipe, type Recipe } from "./theme-generator"
import { EDITABLE_TOKENS, toCss, type Palette } from "./theme-tokens"
import { useStoredJson } from "./use-stored-state"

export const CUSTOM_THEME_STORAGE_KEY = "facade-docs-custom-theme"
export const CUSTOM_THEME_SELECTOR = '[data-facade-theme="custom"]'
const STYLE_ELEMENT_ID = "facade-custom-theme"

/** A closed list: the radius is written into a stylesheet from storage. */
export const RADII = [
  { value: "0rem", label: "None" },
  { value: "0.375rem", label: "Small" },
  { value: "0.625rem", label: "Medium" },
  { value: "1rem", label: "Large" },
] as const

export type Radius = (typeof RADII)[number]["value"]

/** What `globals.css` ships as `--radius` (tested). */
export const DEFAULT_RADIUS: Radius = "0.625rem"

const isRadius = (value: unknown): value is Radius =>
  RADII.some((radius) => radius.value === value)

export interface CustomTheme {
  light: Palette
  dark: Palette
  radius?: Radius
  /** What the palettes were generated from; cleared once a token is hand-edited. */
  recipe?: Recipe
}

const isPalette = (value: unknown): value is Palette => {
  if (typeof value !== "object" || value === null) return false
  const record = value as Record<string, unknown>
  return EDITABLE_TOKENS.every((token) => {
    const raw = record[token]
    return typeof raw === "string" && parseOklch(raw) !== null
  })
}

/**
 * Parses stored JSON, returning `null` for anything that is not a full palette
 * pair. A malformed radius or recipe is dropped rather than fatal.
 */
export function parseCustomTheme(raw: string | null): CustomTheme | null {
  if (!raw) return null
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (typeof parsed !== "object" || parsed === null) return null
  const { light, dark, radius, recipe } = parsed as Record<string, unknown>
  if (!isPalette(light) || !isPalette(dark)) return null

  const theme: CustomTheme = { light, dark }
  if (isRadius(radius)) theme.radius = radius
  const parsedRecipe = parseRecipe(recipe)
  if (parsedRecipe) theme.recipe = parsedRecipe
  return theme
}

/** The stylesheet for a custom theme, also what the Copy CSS button hands over. */
export const customThemeCss = (theme: CustomTheme): string =>
  toCss(theme.light, theme.dark, CUSTOM_THEME_SELECTOR, theme.radius)

/**
 * Upserts the custom theme's stylesheet in `<head>`.
 *
 * Always re-appends: the light block and `globals.css`'s `:root` have the same
 * specificity, so this element only wins while it is last. Next's dev-time
 * style injection appends to head too, and re-appending an existing node moves
 * it rather than duplicating it.
 */
export function applyCustomTheme(theme: CustomTheme | null): void {
  const existing = document.getElementById(STYLE_ELEMENT_ID)
  if (!theme) {
    existing?.remove()
    return
  }
  const style = existing ?? document.createElement("style")
  style.id = STYLE_ELEMENT_ID
  style.textContent = customThemeCss(theme)
  document.head.append(style)
}

/** The stored custom theme, or `null` when there is not one yet. */
export function useCustomTheme(): [
  CustomTheme | null,
  (next: CustomTheme | null) => void,
] {
  const [theme, setRaw] = useStoredJson(CUSTOM_THEME_STORAGE_KEY, parseCustomTheme)
  const set = (next: CustomTheme | null) =>
    setRaw(next === null ? null : JSON.stringify(next))
  return [theme, set]
}
