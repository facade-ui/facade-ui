/**
 * The generator is the promise behind the customiser's basic mode: pick any
 * brand, any neutral, and the theme that comes back passes every check CI
 * runs. These tests are that promise, stated over every choice the swatches
 * offer and over a sweep of the colours they do not.
 */

import { describe, expect, it } from "vitest"

import palettes from "../.generated/palettes.json"
import { contrastRatio, parseOklch } from "./oklch"
import {
  BRAND_FAMILIES,
  DEFAULT_RECIPE,
  NEUTRAL_FAMILIES,
  brandColour,
  generateTheme,
  parseRecipe,
} from "./theme-generator"
import { EDITABLE_TOKENS, checkPalette, type Palette } from "./theme-tokens"

const shipped = palettes as Record<string, Palette>

const failuresOf = (theme: { light: Palette; dark: Palette }): string[] =>
  (["light", "dark"] as const).flatMap((mode) =>
    checkPalette(theme[mode], contrastRatio)
      .filter((check) => !check.passes)
      .map((check) => `${mode}: ${check.label} at ${check.ratio.toFixed(2)}:1`),
  )

describe("the default theme", () => {
  // `globals.css` is written by hand, with a comment naming each Tailwind
  // step. This is what stops those comments — and the claim that the default
  // is simply orange on stone — from drifting away from the values.
  it("is exactly what the default recipe generates", () => {
    const generated = generateTheme(DEFAULT_RECIPE)!
    expect(generated.light).toEqual(shipped["orange-light"])
    expect(generated.dark).toEqual(shipped["orange-dark"])
  })

  it("puts ink, not white, on the primary button", () => {
    // White on orange 600 is 3.6:1. If a future Tailwind darkens its orange
    // enough for white to pass, this fails and the header comment in
    // globals.css wants rewriting.
    const { light } = generateTheme(DEFAULT_RECIPE)!
    expect(light["--primary-foreground"]).toBe(light["--foreground"])
    expect(
      contrastRatio(parseOklch("oklch(1 0 0)")!, parseOklch(light["--primary"])!),
    ).toBeLessThan(4.5)
  })
})

describe("generateTheme", () => {
  const combinations = BRAND_FAMILIES.flatMap((brand) =>
    NEUTRAL_FAMILIES.map((neutral) => ({ brand, neutral })),
  )

  it("offers every chromatic family against every neutral", () => {
    expect(combinations).toHaveLength(17 * 5)
  })

  it.each(combinations)("passes every contrast check — $brand on $neutral", (recipe) => {
    expect(failuresOf(generateTheme(recipe)!)).toEqual([])
  })

  it("emits every token, in a form the stored theme accepts", () => {
    for (const recipe of combinations) {
      const theme = generateTheme(recipe)!
      for (const mode of ["light", "dark"] as const) {
        for (const token of EDITABLE_TOKENS) {
          expect(parseOklch(theme[mode][token]), `${token}`).not.toBeNull()
        }
      }
    }
  })

  it("keeps a family's own 600 as the light primary wherever it clears 3:1", () => {
    // Blue needs no help, so it must come through untouched…
    const blue = generateTheme({ brand: "blue", neutral: "slate" })!
    expect(parseOklch(blue.light["--primary"])).toEqual(brandColour("blue"))
    // …and yellow does, so it must not.
    const yellow = generateTheme({ brand: "yellow", neutral: "stone" })!
    expect(parseOklch(yellow.light["--primary"])!.l).toBeLessThan(
      brandColour("yellow")!.l,
    )
  })

  it("passes every check for a sweep of arbitrary hex brands", () => {
    // Every corner the swatches do not reach: black, white, greys, pastels,
    // neons and the mid-tones where neither white nor ink is an obvious label.
    const failing: string[] = []
    for (let r = 0; r < 256; r += 51)
      for (let g = 0; g < 256; g += 51)
        for (let b = 0; b < 256; b += 51) {
          const hex = "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")
          for (const neutral of NEUTRAL_FAMILIES) {
            const theme = generateTheme({ brand: hex, neutral })
            const failures = theme ? failuresOf(theme) : ["not generated"]
            if (failures.length)
              failing.push(`${hex} on ${neutral}: ${failures.join("; ")}`)
          }
        }
    expect(failing).toEqual([])
  })

  it("returns nothing for a brand that is not a colour", () => {
    expect(generateTheme({ brand: "not-a-colour", neutral: "stone" })).toBeNull()
    expect(generateTheme({ brand: "#12", neutral: "stone" })).toBeNull()
  })
})

describe("parseRecipe", () => {
  it("accepts a family or a hex as the brand", () => {
    expect(parseRecipe({ brand: "orange", neutral: "stone" })).toEqual(DEFAULT_RECIPE)
    expect(parseRecipe({ brand: "#336699", neutral: "zinc" })).toEqual({
      brand: "#336699",
      neutral: "zinc",
    })
  })

  it("rejects anything else", () => {
    for (const bad of [
      null,
      "orange",
      {},
      { brand: "orange" },
      { brand: "orange", neutral: "beige" },
      { brand: "url(evil.css)", neutral: "stone" },
      { brand: 42, neutral: "stone" },
    ]) {
      expect(parseRecipe(bad), JSON.stringify(bad)).toBeNull()
    }
  })
})
