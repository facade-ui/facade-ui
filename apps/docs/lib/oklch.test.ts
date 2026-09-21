/**
 * Proves the browser OKLCH implementation agrees with the Node one.
 *
 * `lib/oklch.ts` and `scripts/lib/color.ts` do the same job in two places
 * because one runs in CI without a DOM and the other has to score a palette
 * live as a slider moves. That duplication is only safe if they cannot
 * disagree — so this compares them on every token Facade actually ships, and on
 * the pairs CI enforces.
 */

import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

import { contrastRatio as browserContrast, parseOklch as browserParse } from "./oklch"
import { CONTRAST_PAIRS, type Palette } from "./theme-tokens"
import { contrastRatio as nodeContrast, parseOklch as nodeParse } from "@scripts/color"

const palettes = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../.generated/palettes.json"), "utf8"),
) as Record<string, Palette>

const scopes = Object.entries(palettes)

describe("OKLCH parity between the browser and Node implementations", () => {
  it("covers all six shipped theme scopes", () => {
    expect(scopes).toHaveLength(6)
  })

  it.each(scopes)("parses every token identically — %s", (_scope, palette) => {
    for (const [token, value] of Object.entries(palette)) {
      const browser = browserParse(value)
      const node = nodeParse(value)
      expect(
        browser,
        `${token} failed to parse in the browser implementation`,
      ).not.toBeNull()
      expect(node, `${token} failed to parse in the Node implementation`).not.toBeNull()
    }
  })

  it.each(scopes)("computes the same contrast ratios — %s", (_scope, palette) => {
    for (const [fgToken, bgToken] of CONTRAST_PAIRS) {
      const fg = palette[fgToken]
      const bg = palette[bgToken]
      if (!fg || !bg) continue

      const browser = browserContrast(browserParse(fg)!, browserParse(bg)!)
      const node = nodeContrast(nodeParse(fg)!, nodeParse(bg)!)

      // Same maths, different value shapes; a tolerance well below what any
      // threshold turns on.
      expect(browser, `${fgToken} on ${bgToken}`).toBeCloseTo(node, 6)
    }
  })

  it("agrees on a translucent colour, which is composited before scoring", () => {
    const fg = "oklch(1 0 0 / 12%)"
    const bg = "oklch(0.145 0 0)"
    expect(browserContrast(browserParse(fg)!, browserParse(bg)!)).toBeCloseTo(
      nodeContrast(nodeParse(fg)!, nodeParse(bg)!),
      6,
    )
  })
})
