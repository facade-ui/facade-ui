/**
 * Emits Tailwind's own colour scales as JSON for the docs theme customiser.
 *
 * The customiser's basic mode builds a whole theme from two choices — a brand
 * colour and a neutral — and both are Tailwind families. The values are read
 * out of the `theme.css` the installed Tailwind ships rather than copied into
 * TypeScript, for the same reason `extract-palettes.ts` reads the presets out
 * of the registry's CSS: a hand-kept copy is right until the day the package
 * is upgraded, and nothing would say so.
 *
 * Values are normalised on the way out. Tailwind writes lightness as a
 * percentage and a grey's hue as `none`; the customiser stores, parses and
 * injects plain `oklch(L C H)` numbers, so that is the only shape it is given.
 *
 * Output: `apps/docs/.generated/tailwind-colors.json`.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { resolve } from "node:path"

import { REPO_ROOT } from "./lib/registry.ts"

/** Every chromatic family, in hue order — which is also the order of the swatches. */
const BRAND_FAMILIES = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
]

const NEUTRAL_FAMILIES = ["stone", "neutral", "zinc", "gray", "slate"]

const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"]

const OUTPUT = resolve(REPO_ROOT, "apps/docs/.generated/tailwind-colors.json")

// Tailwind is a dependency of the docs app, not of the repo root, so it has to
// be resolved from there.
const docsRequire = createRequire(resolve(REPO_ROOT, "apps/docs/package.json"))
const themeCss = readFileSync(docsRequire.resolve("tailwindcss/theme.css"), "utf8")

const round = (n: number, places: number): number => Number.parseFloat(n.toFixed(places))

/** `oklch(64.6% 0.222 41.116)` or `oklch(98.5% 0 none)` -> `oklch(0.646 0.222 41.116)`. */
function normalise(value: string): string | null {
  const match = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+|none)\s*\)$/.exec(value)
  if (!match) return null
  const l = Number.parseFloat(match[1]!) / (match[2] ? 100 : 1)
  const c = Number.parseFloat(match[3]!)
  const h = match[4] === "none" ? 0 : Number.parseFloat(match[4]!)
  return `oklch(${round(l, 5)} ${round(c, 5)} ${round(h, 3)})`
}

const missing: string[] = []

const scale = (family: string): Record<string, string> =>
  Object.fromEntries(
    STEPS.map((step) => {
      const raw = new RegExp(`--color-${family}-${step}:\\s*([^;]+);`).exec(themeCss)?.[1]
      const value = raw ? normalise(raw.trim()) : null
      if (!value) missing.push(`${family}-${step}`)
      return [step, value ?? ""]
    }),
  )

const colors = {
  brand: Object.fromEntries(BRAND_FAMILIES.map((family) => [family, scale(family)])),
  neutral: Object.fromEntries(NEUTRAL_FAMILIES.map((family) => [family, scale(family)])),
}

if (missing.length) {
  console.error(
    `Could not read these colours from tailwindcss/theme.css:\n${missing.map((m) => `  - ${m}`).join("\n")}`,
  )
  process.exit(1)
}

mkdirSync(resolve(OUTPUT, ".."), { recursive: true })
writeFileSync(OUTPUT, JSON.stringify(colors, null, 2) + "\n")
console.log(
  `Extracted ${BRAND_FAMILIES.length} brand and ${NEUTRAL_FAMILIES.length} neutral scales.`,
)
