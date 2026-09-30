/**
 * The custom theme's parser is the boundary between localStorage — which the
 * reader, an older build or a different tab can write — and a stylesheet the
 * site applies to itself. Everything it rejects is something that would
 * otherwise reach the cascade.
 */

import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

import palettes from "../.generated/palettes.json"
import {
  DEFAULT_RADIUS,
  customThemeCss,
  parseCustomTheme,
  type CustomTheme,
} from "./custom-theme"
import { EDITABLE_TOKENS, toCss, type Palette } from "./theme-tokens"

const shipped = palettes as Record<string, Palette>
const theme: CustomTheme = {
  light: shipped["orange-light"]!,
  dark: shipped["orange-dark"]!,
}

describe("parseCustomTheme", () => {
  it("round-trips a full palette pair", () => {
    expect(parseCustomTheme(JSON.stringify(theme))).toEqual(theme)
  })

  it("rejects nothing stored", () => {
    expect(parseCustomTheme(null)).toBeNull()
    expect(parseCustomTheme("")).toBeNull()
  })

  it("rejects malformed JSON", () => {
    expect(parseCustomTheme("{ not json")).toBeNull()
    expect(parseCustomTheme('"a string"')).toBeNull()
    expect(parseCustomTheme("null")).toBeNull()
  })

  it("rejects a pair missing a mode", () => {
    expect(parseCustomTheme(JSON.stringify({ light: theme.light }))).toBeNull()
  })

  it("rejects a palette missing a token", () => {
    const { "--ring": _ring, ...incomplete } = theme.light
    expect(
      parseCustomTheme(JSON.stringify({ light: incomplete, dark: theme.dark })),
    ).toBeNull()
  })

  it("keeps a radius and a recipe it recognises", () => {
    const full: CustomTheme = {
      ...theme,
      radius: "1rem",
      recipe: { brand: "orange", neutral: "stone" },
    }
    expect(parseCustomTheme(JSON.stringify(full))).toEqual(full)
  })

  it("drops a radius or a recipe it does not, and keeps the palette", () => {
    for (const radius of ["2rem", "0.5rem;} body{display:none", 1, null]) {
      expect(parseCustomTheme(JSON.stringify({ ...theme, radius }))).toEqual(theme)
    }
    for (const recipe of ["orange", { brand: "orange", neutral: "beige" }, 7]) {
      expect(parseCustomTheme(JSON.stringify({ ...theme, recipe }))).toEqual(theme)
    }
  })

  it("rejects values that are not OKLCH", () => {
    for (const value of ["#ff0000", "red", "url(evil.css)", "oklch(bad)", 42]) {
      const broken = { ...theme.light, "--primary": value }
      expect(
        parseCustomTheme(JSON.stringify({ light: broken, dark: theme.dark })),
      ).toBeNull()
    }
  })
})

describe("customThemeCss", () => {
  const css = customThemeCss(theme)

  it("scopes both blocks to the custom preset", () => {
    expect(css).toContain('[data-facade-theme="custom"] {')
    // A bare `.dark {}` would override every other preset's dark palette.
    expect(css).not.toMatch(/^\.dark \{/m)
    expect(css).toContain('.dark[data-facade-theme="custom"]')
    expect(css).toContain('.dark [data-facade-theme="custom"]')
    expect(css).toContain('[data-facade-theme="custom"] .dark')
  })

  it("emits every editable token in both modes", () => {
    for (const token of EDITABLE_TOKENS) {
      expect(css.split(`${token}:`).length - 1).toBe(2)
    }
  })

  it("keeps the plain .dark pairing for :root", () => {
    expect(toCss(theme.light, theme.dark)).toMatch(/^\.dark \{/m)
  })

  it("leaves the radius alone until one is chosen", () => {
    expect(css).not.toContain("--radius")
  })

  it("writes a chosen radius once, in the block both modes inherit", () => {
    const rounded = customThemeCss({ ...theme, radius: "1rem" })
    expect(rounded.split("--radius: 1rem;").length - 1).toBe(1)
    expect(rounded.indexOf("--radius")).toBeLessThan(rounded.indexOf(".dark"))
  })
})

describe("DEFAULT_RADIUS", () => {
  it("is the radius globals.css ships", () => {
    const globals = readFileSync(
      resolve(import.meta.dirname, "../../../packages/registry/src/tokens/globals.css"),
      "utf8",
    )
    expect(/--radius:\s*([^;]+);/.exec(globals)?.[1]).toBe(DEFAULT_RADIUS)
  })
})
