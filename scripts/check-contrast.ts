/**
 * Verifies every Facade UI theme preset against the WCAG 2.2 AA bar.
 *
 * Reads the real token values out of `globals.css` and `themes.css`, resolves
 * each theme scope (light/dark x neutral/warm/vivid), and checks the pairs that
 * sections actually put on screen. Text pairs must clear 4.5:1; the focus ring
 * must clear 3:1 against its background. Failures exit non-zero, so CI blocks a
 * palette change that quietly breaks contrast.
 */

import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"
import { contrastRatio, parseOklch, type Rgb } from "./lib/color.ts"

const here = dirname(fileURLToPath(import.meta.url))
const tokensDir = resolve(here, "../packages/registry/src/tokens")

type Tokens = Record<string, string>

/** Pulls `--name: value;` declarations out of the rule whose selector matches. */
function readBlock(css: string, selectorTest: (selector: string) => boolean): Tokens {
  const tokens: Tokens = {}
  const ruleRe = /([^{}]+)\{([^{}]*)\}/g
  let rule: RegExpExecArray | null
  const source = css.replace(/\/\*[\s\S]*?\*\//g, "")
  while ((rule = ruleRe.exec(source)) !== null) {
    // Everything after the previous rule's `}` may include at-statements such as
    // `@import "…";` — the selector is only what follows the final `;`.
    const head = rule[1]!
    const selector = head.slice(head.lastIndexOf(";") + 1).trim()
    if (selector.startsWith("@") || !selectorTest(selector)) continue
    const declRe = /(--[\w-]+)\s*:\s*([^;]+);/g
    let decl: RegExpExecArray | null
    while ((decl = declRe.exec(rule[2]!)) !== null) tokens[decl[1]!] = decl[2]!.trim()
  }
  return tokens
}

const globals = readFileSync(resolve(tokensDir, "globals.css"), "utf8")
const themes = readFileSync(resolve(tokensDir, "themes.css"), "utf8")

const neutralLight = readBlock(globals, (s) => s === ":root")
const neutralDark = readBlock(globals, (s) => s === ".dark")

const preset = (name: string, dark: boolean): Tokens =>
  readBlock(themes, (s) =>
    s.split(",").some((part) => {
      const p = part.trim()
      const scoped = p.includes(`[data-facade-theme="${name}"]`)
      return scoped && p.includes(".dark") === dark
    }),
  )

const scopes: { label: string; tokens: Tokens }[] = [
  { label: "neutral · light", tokens: neutralLight },
  { label: "neutral · dark", tokens: { ...neutralLight, ...neutralDark } },
  { label: "warm · light", tokens: { ...neutralLight, ...preset("warm", false) } },
  {
    label: "warm · dark",
    tokens: { ...neutralLight, ...neutralDark, ...preset("warm", true) },
  },
  { label: "vivid · light", tokens: { ...neutralLight, ...preset("vivid", false) } },
  {
    label: "vivid · dark",
    tokens: { ...neutralLight, ...neutralDark, ...preset("vivid", true) },
  },
]

/** `[foreground, background, minimum ratio, what it is]` */
const PAIRS: [string, string, number, string][] = [
  ["--foreground", "--background", 4.5, "body text"],
  ["--muted-foreground", "--background", 4.5, "supporting copy"],
  ["--muted-foreground", "--muted", 4.5, "copy on muted panels"],
  ["--card-foreground", "--card", 4.5, "card text"],
  ["--popover-foreground", "--popover", 4.5, "popover text"],
  ["--primary-foreground", "--primary", 4.5, "primary button label"],
  ["--secondary-foreground", "--secondary", 4.5, "secondary button label"],
  ["--accent-foreground", "--accent", 4.5, "accent surface text"],
  ["--destructive-foreground", "--destructive", 4.5, "destructive button label"],
  ["--primary", "--background", 3, "primary as a surface/icon"],
  ["--ring", "--background", 3, "focus ring"],
  ["--ring", "--card", 3, "focus ring on cards"],
  // A form field's border is the only thing identifying it as a field, so it is
  // a UI component boundary under WCAG 1.4.11 rather than decoration.
  ["--input", "--background", 3, "form field border"],
  ["--input", "--card", 3, "form field border on cards"],
]

/** Reported but not enforced: hairline dividers are decorative, not UI boundaries. */
const INFORMATIONAL = new Set(["--border"])

let failures = 0
const rows: string[] = []

for (const { label, tokens } of scopes) {
  rows.push(`\n  ${label}`)
  const resolveToken = (name: string): Rgb | null => {
    const raw = tokens[name]
    return raw ? parseOklch(raw) : null
  }

  const checks: [string, string, number, string][] = [
    ...PAIRS,
    ...[...INFORMATIONAL].map(
      (n) =>
        [n, "--background", 3, "hairline (informational)"] as [
          string,
          string,
          number,
          string,
        ],
    ),
  ]

  for (const [fgName, bgName, min, what] of checks) {
    const fg = resolveToken(fgName)
    const bg = resolveToken(bgName)
    if (!fg || !bg) {
      rows.push(`    ?  ${fgName} on ${bgName} — token missing or unparsed`)
      failures += 1
      continue
    }
    const ratio = contrastRatio(fg, bg)
    const ok = ratio >= min
    const soft = INFORMATIONAL.has(fgName)
    if (!ok && !soft) failures += 1
    const mark = ok ? "ok" : soft ? "--" : "FAIL"
    rows.push(
      `    ${mark.padEnd(4)} ${ratio.toFixed(2).padStart(5)}:1 (min ${min})  ${fgName} on ${bgName} — ${what}`,
    )
  }
}

console.log("Facade UI — token contrast (WCAG 2.2 AA)")
console.log(rows.join("\n"))

if (failures > 0) {
  console.error(`\n${failures} contrast check(s) failed.`)
  process.exit(1)
}
console.log("\nAll enforced contrast checks passed.")
