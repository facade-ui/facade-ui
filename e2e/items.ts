/**
 * The list of previewable registry items, read from the docs app's demo map.
 *
 * Deriving it means a new section is covered by the accessibility and visual
 * suites the moment its demo exists — there is no second list to remember to
 * update, and no way to add a component that quietly ships untested.
 */

import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const source = readFileSync(
  resolve(import.meta.dirname, "../apps/docs/demos/index.ts"),
  "utf8",
)

/** Pulls the keys out of the `demos` record literal. */
function parseDemoNames(): string[] {
  const body = /export const demos[^{]*\{([\s\S]*?)\n\}/.exec(source)?.[1]
  if (!body)
    throw new Error("Could not find the demos record in apps/docs/demos/index.ts")

  return [...body.matchAll(/^\s*"?([a-z0-9-]+)"?\s*:/gm)].map((match) => match[1]!)
}

export const PREVIEW_ITEMS = parseDemoNames()

/** Widths the visual suite captures, matching the docs' own breakpoint toggle. */
export const BREAKPOINTS = [
  { name: "375", width: 375, height: 900 },
  { name: "768", width: 768, height: 1000 },
  { name: "1280", width: 1280, height: 1000 },
] as const
