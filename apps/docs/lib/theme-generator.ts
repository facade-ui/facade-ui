/**
 * Builds a full theme — every token, light and dark — from a brand and a neutral.
 *
 * It takes Tailwind's steps, then walks a colour's lightness wherever a
 * `CONTRAST_PAIRS` pair would fail. `DEFAULT_RECIPE` reproduces `globals.css`
 * exactly (tested). A hex brand gets a scale synthesised around it.
 */

import tailwind from "@/.generated/tailwind-colors.json"
import {
  clamp01,
  contrastRatio,
  formatOklch,
  fromHex,
  parseOklch,
  type Oklch,
} from "./oklch"
import type { Palette } from "./theme-tokens"

type BrandFamily = keyof typeof tailwind.brand
export type NeutralFamily = keyof typeof tailwind.neutral
type Step = keyof (typeof tailwind.neutral)[NeutralFamily]

export const BRAND_FAMILIES = Object.keys(tailwind.brand) as BrandFamily[]
export const NEUTRAL_FAMILIES = Object.keys(tailwind.neutral) as NeutralFamily[]

export interface Recipe {
  /** A Tailwind family name, or any colour as a hex code. */
  brand: string
  neutral: NeutralFamily
}

export const DEFAULT_RECIPE: Recipe = { brand: "orange", neutral: "stone" }

const isBrandFamily = (value: string): value is BrandFamily =>
  (BRAND_FAMILIES as string[]).includes(value)

const isNeutralFamily = (value: unknown): value is NeutralFamily =>
  typeof value === "string" && (NEUTRAL_FAMILIES as string[]).includes(value)

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

const parseScale = (scale: Record<Step, string>): Record<Step, Oklch> =>
  Object.fromEntries(
    Object.entries(scale).map(([step, value]) => [step, must(value)]),
  ) as Record<Step, Oklch>

/** The brand steps the recipe uses. */
type BrandScale = Pick<Record<Step, Oklch>, "100" | "300" | "500" | "600" | "800" | "950">

function brandScale(brand: string): BrandScale | null {
  if (isBrandFamily(brand)) return parseScale(tailwind.brand[brand])

  // A hex stands in for 600; the other steps keep its hue and take the
  // lightness, and a share of the chroma, that Tailwind's own scales use.
  const base = fromHex(brand)
  if (!base) return null
  const { c, h } = base
  const step = (l: number, chroma: number): Oklch => ({ l, c: chroma, h, a: 1 })
  return {
    "100": step(0.954, Math.min(c * 0.18, 0.04)),
    "300": step(0.84, Math.min(c * 0.6, 0.13)),
    // Never darker than Tailwind's 500s, or it would not read on a dark page.
    "500": step(Math.min(Math.max(base.l + 0.06, 0.7), 0.9), c),
    "600": { ...base, a: 1 },
    "800": step(0.47, Math.min(c * 0.75, 0.16)),
    "950": step(0.27, Math.min(c * 0.4, 0.08)),
  }
}

/** The colour a recipe's brand starts from: a family's 600, or the hex itself. */
export const brandColour = (brand: string): Oklch | null =>
  brandScale(brand)?.["600"] ?? null

const LIGHTNESS_STEP = 0.005
/** Walked colours are rounded when stored; this keeps them clear of the line. */
const MARGIN = 0.02

/** `colour` if it clears `min` against every backdrop, else walked until it does. */
function ensure(colour: Oklch, against: Oklch[], min: number, direction: -1 | 1): Oklch {
  const clears = (candidate: Oklch, bar: number) =>
    against.every((backdrop) => contrastRatio(candidate, backdrop) >= bar)

  if (clears(colour, min)) return colour
  let next = colour
  while (!clears(next, min + MARGIN) && next.l > 0 && next.l < 1) {
    next = { ...next, l: clamp01(next.l + direction * LIGHTNESS_STEP) }
  }
  return next
}

const toPalette = (colours: Record<keyof Palette, Oklch>): Palette =>
  Object.fromEntries(
    Object.entries(colours).map(([token, colour]) => [token, formatOklch(colour)]),
  ) as Palette

/** Both palettes for a recipe, or `null` if its brand is not a colour. */
export function generateTheme(recipe: Recipe): { light: Palette; dark: Palette } | null {
  const brand = brandScale(recipe.brand)
  if (!brand) return null

  const n = parseScale(tailwind.neutral[recipe.neutral])
  const paper = n["50"]
  const ink = n["950"]

  // A fill and its label: paper if it clears 4.5:1, else ink, else the fill
  // moves until the label that suits the mode does.
  const filled = (surface: Oklch, direction: -1 | 1) => {
    if (contrastRatio(paper, surface) >= 4.5) return { surface, label: paper }
    if (contrastRatio(ink, surface) >= 4.5) return { surface, label: ink }
    const label = direction === -1 ? paper : ink
    return { surface: ensure(surface, [label], 4.5, direction), label }
  }

  const lightPrimary = filled(ensure(brand["600"], [WHITE], 3, -1), -1)
  const lightDestructive = filled(must(tailwind.brand.red["600"]), -1)

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
    "--muted": n["100"],
    "--muted-foreground": ensure(n["600"], [WHITE, n["100"]], 4.5, -1),
    "--accent": brand["100"],
    "--accent-foreground": ensure(brand["800"], [brand["100"]], 4.5, -1),
    "--destructive": lightDestructive.surface,
    "--destructive-foreground": lightDestructive.label,
    "--border": n["200"],
    // A field's edge needs 3:1 (WCAG 1.4.11); 400 is 2.6:1 on white.
    "--input": ensure(n["400"], [WHITE], 3, -1),
    "--ring": lightPrimary.surface,
  })

  const background = n["950"]
  const card = n["900"]
  const darkPrimary = filled(ensure(brand["500"], [background, card], 3, 1), 1)
  const darkDestructive = filled(must(tailwind.brand.red["400"]), 1)

  const dark = toPalette({
    "--background": background,
    "--foreground": paper,
    "--card": card,
    "--card-foreground": paper,
    "--popover": n["800"],
    "--popover-foreground": paper,
    "--primary": darkPrimary.surface,
    "--primary-foreground": darkPrimary.label,
    "--secondary": n["800"],
    "--secondary-foreground": paper,
    "--muted": n["800"],
    "--muted-foreground": ensure(n["400"], [background, n["800"]], 4.5, 1),
    "--accent": brand["950"],
    "--accent-foreground": ensure(brand["300"], [brand["950"]], 4.5, 1),
    "--destructive": darkDestructive.surface,
    "--destructive-foreground": darkDestructive.label,
    "--border": { ...WHITE, a: 0.12 },
    "--input": ensure(n["500"], [background, card], 3, 1),
    "--ring": darkPrimary.surface,
  })

  return { light, dark }
}
