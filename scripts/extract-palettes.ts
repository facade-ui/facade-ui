/**
 * Emits the shipped theme presets as JSON for the docs theme customiser.
 *
 * The customiser starts from a real preset and lets you edit it, so the values
 * it loads must be the ones that actually ship. Reading them out of the CSS at
 * build time is the only way to guarantee that; a hand-kept copy would drift the
 * first time a token changed.
 *
 * Output: `apps/docs/.generated/palettes.json`.
 */

import { mkdirSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

import { REPO_ROOT } from "./lib/registry.ts"
import { readScopes } from "./lib/css-tokens.ts"

const EXPORTED = [
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
]

const OUTPUT = resolve(REPO_ROOT, "apps/docs/.generated/palettes.json")

const palettes = Object.fromEntries(
  readScopes().map((scope) => [
    `${scope.preset}-${scope.mode}`,
    Object.fromEntries(
      EXPORTED.map((token) => [token, scope.tokens[token] ?? ""]).filter(
        ([, value]) => value,
      ),
    ),
  ]),
)

const missing = Object.entries(palettes).flatMap(([scope, tokens]) =>
  EXPORTED.filter((token) => !(token in tokens)).map((token) => `${scope}: ${token}`),
)
if (missing.length) {
  console.error(`Missing tokens:\n${missing.map((m) => `  - ${m}`).join("\n")}`)
  process.exit(1)
}

mkdirSync(resolve(OUTPUT, ".."), { recursive: true })
writeFileSync(OUTPUT, JSON.stringify(palettes, null, 2) + "\n")
console.log(`Extracted ${Object.keys(palettes).length} palettes.`)
