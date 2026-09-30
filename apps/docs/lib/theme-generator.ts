/**
 * Builds a whole theme — nineteen tokens, light and dark — from two choices.
 *
 * This is what the customiser's basic mode runs on, and what the registry's
 * default theme is: `generateTheme(DEFAULT_RECIPE)` is, token for token, the
 * palette in `globals.css`. A test holds the two together, so "the default is
 * Tailwind's orange on stone" is a statement about the code rather than a
 * description of it.
 *
 * The recipe is the usual Tailwind pairing, written down once:
 *
 *   surfaces and copy   the neutral scale — 50/100/200 light, 950/900/800 dark
 *   primary             brand 600 on light, brand 500 on dark
 *   accent              brand 100 + 800 on light, brand 950 + 300 on dark
 *
 * …with one difference from picking the steps by hand: every pair
 * `CONTRAST_PAIRS` scores is *made* to pass. Where a step falls short, its
 * lightness is walked until it does not — which is why yellow's primary lands
 * darker than its 600, and why a form border is not simply neutral 400. The
 * label on a primary button is whichever of near-white and ink clears 4.5:1;
 * for orange that is ink, because white on orange 600 is 3.6:1 and no amount
 * of liking it changes that.
 *
 * A brand given as a hex has no scale, so one is synthesised around it: the
 * colour itself stands in for 600, and the other steps keep its hue while
 * taking the lightness (and a share of the chroma) Tailwind's own scales use.
 */

import tailwind from "@/.generated/tailwind-colors.json"
import { contrastRatio, formatOklch, fromHex, parseOklch, type Oklch } from "./oklch"
import type { Palette } from "./theme-tokens"

export type BrandFamily = keyof typeof tailwind.brand
export type NeutralFamily = keyof typeof tailwind.neutral

export const BRAND_FAMILIES = Object.keys(tailwind.brand) as BrandFamily[]
export const NEUTRAL_FAMILIES = Object.keys(tailwind.neutral) as NeutralFamily[]

export interface Recipe {
  /** A Tailwind family name, or any colour as a hex code. */
  brand: string
  neutral: NeutralFamily
}

export const DEFAULT_RECIPE: Recipe = { brand: "orange", neutral: "stone" }

export const isBrandFamily = (value: string): value is BrandFamily =>
  (BRAND_FAMILIES as string[]).includes(value)

export const isNeutralFamily = (value: unknown): value is NeutralFamily =>
  typeof value === "string" && (NEUTRAL_FAMILIES as string[]).includes(value)

/** A recipe is valid when its brand is a family or a hex and its neutral a family. */
export function parseRecipe(value: unknown): Recipe | null {
  if (typeof value !== "object" || value === null) return null
  const { brand, neutral } = value as Record<string, unknown>
  if (typeof brand !== "string" || !isNeutralFamily(neutral)) return null
  if (!isBrandFamily(brand) && fromHex(brand) === null) return null
  return { brand, neutral }
}

const WHITE: Oklch = { l: 1, c: 0, h: 0, a: 1 }

const must = (value: string): Oklch => {
  const colour = parseOklch(value)
  if (!colour) throw new Error(`Not an OKLCH colour: ${value}`)
  return colour
}

/** The steps of a brand scale the recipe uses. */
interface BrandScale {
  100: Oklch
  300: Oklch
  500: Oklch
  600: Oklch
  800: Oklch
  950: Oklch
}

const clamp = (n: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, n))

function brandScale(brand: string): BrandScale | null {
  if (isBrandFamily(brand)) {
    const scale = tailwind.brand[brand]
    return {
      100: must(scale["100"]),
      300: must(scale["300"]),
      500: must(scale["500"]),
      600: must(scale["600"]),
      800: must(scale["800"]),
      950: must(scale["950"]),
    }
  }

  const base = fromHex(brand)
  if (!base) return null
  const { c, h } = base
  const step = (l: number, chroma: number): Oklch => ({ l, c: chroma, h, a: 1 })
  return {
    100: step(0.954, Math.min(c * 0.18, 0.04)),
    300: step(0.84, Math.min(c * 0.6, 0.13)),
    // Never darker than Tailwind's own 500s, or it would not read on a dark page.
    500: step(clamp(base.l + 0.06, 0.7, 0.9), c),
    600: { ...base, a: 1 },
    800: step(0.47, Math.min(c * 0.75, 0.16)),
    950: step(0.27, Math.min(c * 0.4, 0.08)),
  }
}

/** The colour a recipe's brand starts from — a family's 600, or the hex itself. */
export const brandColour = (brand: string): Oklch | null =>
  brandScale(brand)?.[600] ?? null

const LIGHTNESS_STEP = 0.005
/** Walked colours are rounded when stored; this keeps them clear of the line. */
const MARGIN = 0.02

/**
 * Returns `colour` if it already clears `min` against every backdrop, and
 * otherwise walks its lightness — down for `-1`, up for `1` — until it does.
 */
function ensure(colour: Oklch, against: Oklch[], min: number, direction: -1 | 1): Oklch {
  const clears = (candidate: Oklch, bar: number) =>
    against.every((backdrop) => contrastRatio(candidate, backdrop) >= bar)

  if (clears(colour, min)) return colour
  let next = colour
  while (!clears(next, min + MARGIN) && next.l > 0 && next.l < 1) {
    next = { ...next, l: clamp(next.l + direction * LIGHTNESS_STEP, 0, 1) }
  }
  return next
}

/**
 * A filled surface and the label that goes on it.
 *
 * Near-white is tried first because it is the convention, ink second because
 * for a bright fill it is the only honest answer. The sliver of mid-tones
 * where neither clears 4.5:1 is closed by moving the surface: darker on a
 * light page, lighter on a dark one.
 */
function filled(
  surface: Oklch,
  light: Oklch,
  ink: Oklch,
  direction: -1 | 1,
): { surface: Oklch; label: Oklch } {
  if (contrastRatio(light, surface) >= 4.5) return { surface, label: light }
  if (contrastRatio(ink, surface) >= 4.5) return { surface, label: ink }

  const label = direction === -1 ? light : ink
  let next = surface
  while (contrastRatio(label, next) < 4.5 + MARGIN && next.l > 0 && next.l < 1) {
    next = { ...next, l: clamp(next.l + direction * LIGHTNESS_STEP, 0, 1) }
  }
  return { surface: next, label }
}

const toPalette = (colours: Record<keyof Palette, Oklch | string>): Palette =>
  Object.fromEntries(
    Object.entries(colours).map(([token, colour]) => [
      token,
      typeof colour === "string" ? colour : formatOklch(colour),
    ]),
  ) as Palette

/** Both palettes for a recipe, or `null` if its brand is not a colour. */
export function generateTheme(recipe: Recipe): { light: Palette; dark: Palette } | null {
  const brand = brandScale(recipe.brand)
  if (!brand) return null

  const n = Object.fromEntries(
    Object.entries(tailwind.neutral[recipe.neutral]).map(([step, value]) => [
      step,
      must(value),
    ]),
  ) as Record<keyof (typeof tailwind.neutral)[NeutralFamily], Oklch>

  const red = tailwind.brand.red
  const label = n["50"]
  const ink = n["950"]

  // ---------------------------------------------------------------- light
  const lightPrimary = filled(ensure(brand[600], [WHITE], 3, -1), label, ink, -1)
  const lightDestructive = filled(must(red["600"]), label, ink, -1)
  const lightMuted = n["100"]

  const light = toPalette({
    "--background": WHITE,
    "--foreground": ink,
    "--card": WHITE,
    "--card-foreground": ink,
    "--popover": WHITE,
    "--popover-foreground": ink,
    "--primary": lightPrimary.surface,
    "--primary-foreground": lightPrimary.label,
    "--secondary": n["100"],
    "--secondary-foreground": n["900"],
    "--muted": lightMuted,
    "--muted-foreground": ensure(n["600"], [WHITE, lightMuted], 4.5, -1),
    "--accent": brand[100],
    "--accent-foreground": ensure(brand[800], [brand[100]], 4.5, -1),
    "--destructive": lightDestructive.surface,
    "--destructive-foreground": lightDestructive.label,
    "--border": n["200"],
    // The edge of a field is a UI boundary (WCAG 1.4.11), so it is walked down
    // from 400 until it clears 3:1. No Tailwind step lands there: 400 is
    // 2.6:1 on white and 500 is nearly 5.
    "--input": ensure(n["400"], [WHITE], 3, -1),
    "--ring": ensure(lightPrimary.surface, [WHITE], 3, -1),
  })

  // ----------------------------------------------------------------- dark
  const background = n["950"]
  const card = n["900"]
  const darkPrimary = filled(ensure(brand[500], [background, card], 3, 1), label, ink, 1)
  const darkDestructive = filled(must(red["400"]), label, ink, 1)
  const darkMuted = n["800"]

  const dark = toPalette({
    "--background": background,
    "--foreground": label,
    "--card": card,
    "--card-foreground": label,
    "--popover": n["800"],
    "--popover-foreground": label,
    "--primary": darkPrimary.surface,
    "--primary-foreground": darkPrimary.label,
    "--secondary": n["800"],
    "--secondary-foreground": label,
    "--muted": darkMuted,
    "--muted-foreground": ensure(n["400"], [background, darkMuted], 4.5, 1),
    "--accent": brand[950],
    "--accent-foreground": ensure(brand[300], [brand[950]], 4.5, 1),
    "--destructive": darkDestructive.surface,
    "--destructive-foreground": darkDestructive.label,
    "--border": "oklch(1 0 0 / 12%)",
    "--input": ensure(n["500"], [background, card], 3, 1),
    "--ring": ensure(darkPrimary.surface, [background, card], 3, 1),
  })

  return { light, dark }
}
