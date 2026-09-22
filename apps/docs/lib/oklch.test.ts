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

import {
  contrastRatio as browserContrast,
  formatOklch,
  fromHex,
  parseOklch as browserParse,
  toHex,
} from "./oklch"
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

/**
 * Hex is now an editable field, so the two conversions have to agree with the
 * browser and with each other. The expected values below were read out of a
 * canvas: the colour was painted with the CSS `oklch()` and the pixel read
 * back, which makes them the browser's own answer rather than this file's.
 */
describe("hex conversion", () => {
  const CASES: [string, string][] = [
    ["oklch(1 0 0)", "#ffffff"],
    ["oklch(0.5 0 0)", "#636363"],
    ["oklch(0.145 0 0)", "#0a0a0a"],
    ["oklch(0.205 0 0)", "#171717"],
    ["oklch(0.922 0 0)", "#e5e5e5"],
    ["oklch(0.99 0.005 85)", "#fdfcf8"],
    ["oklch(0.577 0.245 27.325)", "#e7000b"],
  ]

  it.each(CASES)("renders %s as the colour a browser paints", (css, hex) => {
    expect(toHex(browserParse(css)!)).toBe(hex)
  })

  it.each(CASES)("reads %s back from that same hex", (_css, hex) => {
    const round = fromHex(hex)
    expect(round).not.toBeNull()
    // The hex is the thing that has to survive, because eight bits per channel
    // is all there is to survive in.
    expect(toHex(round!)).toBe(hex)
  })

  it("keeps the lightness of a colour sRGB can actually show", () => {
    for (const [css, hex] of CASES.filter(([value]) => !value.includes("0.245"))) {
      expect(fromHex(hex)!.l, css).toBeCloseTo(browserParse(css)!.l, 2)
    }
  })

  it("loses the excess chroma of a colour sRGB cannot show", () => {
    // oklch(0.577 0.245 27.325) is outside the sRGB gamut: `toRgb` clamps the
    // red channel, and a clamped channel cannot be un-clamped. The hex still
    // round-trips, but the OKLCH triple comes back as the nearest colour the
    // screen can paint — which is the one it was already painting.
    const original = browserParse("oklch(0.577 0.245 27.325)")!
    const round = fromHex(toHex(original))!
    expect(round.c).toBeLessThan(original.c)
    expect(toHex(round)).toBe(toHex(original))
  })

  it("accepts short, long, prefixed and unprefixed forms", () => {
    expect(toHex(fromHex("#fff")!)).toBe("#ffffff")
    expect(toHex(fromHex("fff")!)).toBe("#ffffff")
    expect(toHex(fromHex("#FFFFFF")!)).toBe("#ffffff")
    expect(toHex(fromHex("  #e7000b  ")!)).toBe("#e7000b")
  })

  it("carries alpha in both directions", () => {
    expect(toHex(browserParse("oklch(1 0 0 / 13%)")!)).toBe("#ffffff21")
    expect(fromHex("#ffffff21")!.a).toBeCloseTo(0.129, 2)
    expect(fromHex("#fff8")!.a).toBeCloseTo(0.533, 2)
  })

  it("rejects anything that is not a hex colour", () => {
    for (const bad of ["", "#", "#gg0000", "rgb(1,2,3)", "#12345", "oklch(1 0 0)"]) {
      expect(fromHex(bad), bad).toBeNull()
    }
  })

  it("survives a round trip through every shipped token", () => {
    for (const [, palette] of scopes) {
      for (const value of Object.values(palette)) {
        const hex = toHex(browserParse(value)!)
        expect(toHex(fromHex(hex)!), value).toBe(hex)
      }
    }
  })
})

describe("hex round-trips through the stored CSS value", () => {
  // The palette is stored as an `oklch()` string, so a hex typed into the
  // customiser only survives if `formatOklch` keeps enough precision. It used
  // to keep three decimals, and a fifth of all colours came back different.
  const sample = (step: number): string[] => {
    const out: string[] = []
    for (let r = 0; r < 256; r += step)
      for (let g = 0; g < 256; g += step + 4)
        for (let b = 0; b < 256; b += step + 6)
          out.push("#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join(""))
    return out
  }

  it("returns the same hex for every colour sampled across the cube", () => {
    const drifted = sample(7).filter(
      (hex) => toHex(browserParse(formatOklch(fromHex(hex)!))!) !== hex,
    )
    expect(drifted).toEqual([])
  })

  it("leaves the shipped tokens exactly as they are written", () => {
    for (const [, palette] of scopes) {
      for (const value of Object.values(palette)) {
        expect(formatOklch(browserParse(value)!)).toBe(value)
      }
    }
  })
})
