/**
 * Emits the installed Tailwind's colour scales as JSON for the docs theme
 * customiser, read from its `theme.css` so they cannot drift from the package.
 *
 * Output: `apps/docs/.generated/tailwind-colors.json`.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { createRequire } from "node:module"
import { resolve } from "node:path"

import { formatOklch, parseOklch } from "../apps/docs/lib/oklch.ts"
import { REPO_ROOT } from "./lib/registry.ts"

/** Every chromatic family, in hue order, which is also the swatch order. */
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

// Tailwind is a dependency of the docs app, not of the repo root.
const docsRequire = createRequire(resolve(REPO_ROOT, "apps/docs/package.json"))
const themeCss = readFileSync(docsRequire.resolve("tailwindcss/theme.css"), "utf8")

/** Tailwind writes a grey's hue as `none`; the customiser stores plain numbers. */
function normalise(value: string): string | null {
  const colour = parseOklch(value.replace(/\bnone\b/, "0"))
  return colour ? formatOklch(colour) : null
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
