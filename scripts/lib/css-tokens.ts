/**
 * Reads the shipped token values out of the registry's CSS.
 *
 * Shared by the contrast checker and the palette extractor so both look at the
 * same thing: the real stylesheet. Anything that re-declares a palette in
 * TypeScript can drift from what ships, and this is the layer where drift would
 * be least visible.
 */

import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import { REGISTRY_ROOT } from "./registry.ts"

export type Tokens = Record<string, string>

const tokensDir = resolve(REGISTRY_ROOT, "src/tokens")

/** Pulls `--name: value;` declarations from every rule whose selector matches. */
export function readBlock(
  css: string,
  selectorTest: (selector: string) => boolean,
): Tokens {
  const tokens: Tokens = {}
  const source = css.replace(/\/\*[\s\S]*?\*\//g, "")
  const ruleRe = /([^{}]+)\{([^{}]*)\}/g
  let rule: RegExpExecArray | null

  while ((rule = ruleRe.exec(source)) !== null) {
    // Everything after the previous rule's `}` may include at-statements such
    // as `@import "…";` — the selector is only what follows the final `;`.
    const head = rule[1]!
    const selector = head.slice(head.lastIndexOf(";") + 1).trim()
    if (selector.startsWith("@") || !selectorTest(selector)) continue

    const declRe = /(--[\w-]+)\s*:\s*([^;]+);/g
    let decl: RegExpExecArray | null
    while ((decl = declRe.exec(rule[2]!)) !== null) tokens[decl[1]!] = decl[2]!.trim()
  }
  return tokens
}

export const globalsCss = (): string =>
  readFileSync(resolve(tokensDir, "globals.css"), "utf8")
export const themesCss = (): string =>
  readFileSync(resolve(tokensDir, "themes.css"), "utf8")

export interface Scope {
  preset: "neutral" | "warm" | "vivid"
  mode: "light" | "dark"
  label: string
  tokens: Tokens
}

/** All six theme scopes, each fully resolved through its inheritance chain. */
export function readScopes(): Scope[] {
  const globals = globalsCss()
  const themes = themesCss()

  const neutralLight = readBlock(globals, (s) => s === ":root")
  const neutralDark = readBlock(globals, (s) => s === ".dark")

  const preset = (name: string, dark: boolean): Tokens =>
    readBlock(themes, (s) =>
      s.split(",").some((part) => {
        const p = part.trim()
        return p.includes(`[data-facade-theme="${name}"]`) && p.includes(".dark") === dark
      }),
    )

  return [
    { preset: "neutral", mode: "light", label: "neutral · light", tokens: neutralLight },
    {
      preset: "neutral",
      mode: "dark",
      label: "neutral · dark",
      tokens: { ...neutralLight, ...neutralDark },
    },
    {
      preset: "warm",
      mode: "light",
      label: "warm · light",
      tokens: { ...neutralLight, ...preset("warm", false) },
    },
    {
      preset: "warm",
      mode: "dark",
      label: "warm · dark",
      tokens: { ...neutralLight, ...neutralDark, ...preset("warm", true) },
    },
    {
      preset: "vivid",
      mode: "light",
      label: "vivid · light",
      tokens: { ...neutralLight, ...preset("vivid", false) },
    },
    {
      preset: "vivid",
      mode: "dark",
      label: "vivid · dark",
      tokens: { ...neutralLight, ...neutralDark, ...preset("vivid", true) },
    },
  ]
}
