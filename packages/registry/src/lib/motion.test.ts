/**
 * Guards the one duplication in the codebase: motion needs numbers, CSS needs
 * custom properties, so the durations and easings exist in both places. This
 * test reads the real stylesheet and fails if they ever drift apart.
 */

import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

import { FACADE_DURATION_MS, FACADE_MOTION_DISTANCE_REM, facadeEase } from "./motion"

const css = readFileSync(resolve(import.meta.dirname, "../tokens/globals.css"), "utf8")

const tokenValue = (name: string): string => {
  const match = new RegExp(`--${name}:\\s*([^;]+);`).exec(css)
  if (!match) throw new Error(`token --${name} not found in globals.css`)
  return match[1]!.trim()
}

describe("motion tokens", () => {
  it.each([
    ["fast", FACADE_DURATION_MS.fast],
    ["base", FACADE_DURATION_MS.base],
    ["slow", FACADE_DURATION_MS.slow],
  ])("duration %s matches the CSS token", (name, ms) => {
    expect(tokenValue(`facade-duration-${name}`)).toBe(`${ms}ms`)
  })

  it.each([
    ["out", facadeEase.out],
    ["in-out", facadeEase.inOut],
    ["spring", facadeEase.spring],
  ])("easing %s matches the CSS token", (name, bezier) => {
    expect(tokenValue(`facade-ease-${name}`)).toBe(`cubic-bezier(${bezier.join(", ")})`)
  })

  it("travel distance matches the CSS token", () => {
    expect(tokenValue("facade-motion-distance")).toBe(`${FACADE_MOTION_DISTANCE_REM}rem`)
  })
})
