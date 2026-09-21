/**
 * The token set the theme customiser edits, and the contrast pairs it scores.
 *
 * Deliberately the same list `scripts/check-contrast.ts` enforces in CI, so a
 * palette that shows all-green in the customiser is one that would pass the
 * build. A customiser that let you export a failing theme would be worse than
 * none at all.
 */

import { parseOklch, type Oklch } from "./oklch"

export const EDITABLE_TOKENS = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  "--border",
  "--input",
  "--ring",
] as const

export type TokenName = (typeof EDITABLE_TOKENS)[number]
export type Palette = Record<TokenName, string>

/** `[foreground, background, minimum ratio, what it is]` — mirrors CI. */
export const CONTRAST_PAIRS: [TokenName, TokenName, number, string][] = [
  ["--foreground", "--background", 4.5, "Body text"],
  ["--muted-foreground", "--background", 4.5, "Supporting copy"],
  ["--muted-foreground", "--muted", 4.5, "Copy on muted panels"],
  ["--card-foreground", "--card", 4.5, "Card text"],
  ["--popover-foreground", "--popover", 4.5, "Popover text"],
  ["--primary-foreground", "--primary", 4.5, "Primary button label"],
  ["--secondary-foreground", "--secondary", 4.5, "Secondary button label"],
  ["--accent-foreground", "--accent", 4.5, "Accent surface text"],
  ["--destructive-foreground", "--destructive", 4.5, "Destructive button label"],
  ["--primary", "--background", 3, "Primary as a surface or icon"],
  ["--ring", "--background", 3, "Focus ring"],
  ["--ring", "--card", 3, "Focus ring on cards"],
  ["--input", "--background", 3, "Form field border"],
  ["--input", "--card", 3, "Form field border on cards"],
]

/**
 * Tokens that are lightened or darkened together when the user nudges a single
 * "brand" colour, so the accessible pairing survives the change.
 */
export const LINKED_FOREGROUNDS: Partial<Record<TokenName, TokenName>> = {
  "--primary": "--primary-foreground",
  "--secondary": "--secondary-foreground",
  "--muted": "--muted-foreground",
  "--accent": "--accent-foreground",
  "--destructive": "--destructive-foreground",
  "--card": "--card-foreground",
  "--popover": "--popover-foreground",
  "--background": "--foreground",
}

export interface PaletteCheck {
  fg: TokenName
  bg: TokenName
  label: string
  min: number
  ratio: number
  passes: boolean
}

export const resolve = (palette: Palette, token: TokenName): Oklch | null =>
  parseOklch(palette[token])

/** Scores a palette against the same bar CI enforces. */
export function checkPalette(
  palette: Palette,
  contrast: (fg: Oklch, bg: Oklch) => number,
): PaletteCheck[] {
  return CONTRAST_PAIRS.map(([fg, bg, min, label]) => {
    const fgColor = resolve(palette, fg)
    const bgColor = resolve(palette, bg)
    const ratio = fgColor && bgColor ? contrast(fgColor, bgColor) : 0
    return { fg, bg, label, min, ratio, passes: ratio >= min }
  })
}

/** Emits a `globals.css`-shaped block the user can paste into their project. */
export function toCss(light: Palette, dark: Palette, selector = ":root"): string {
  const block = (tokens: Palette) =>
    EDITABLE_TOKENS.map((token) => `  ${token}: ${tokens[token]};`).join("\n")

  return `${selector} {\n${block(light)}\n}\n\n.dark {\n${block(dark)}\n}\n`
}
