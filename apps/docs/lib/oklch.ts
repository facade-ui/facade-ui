/**
 * OKLCH parsing, formatting and contrast, for the theme customiser.
 *
 * A browser-side twin of `scripts/lib/color.ts`, which does the same job at
 * build time. The duplication is deliberate: the script runs under Node with no
 * DOM, and the customiser has to score a palette live as the user drags a
 * slider. `oklch.test.ts` checks both implementations agree on the tokens that
 * actually ship, so they cannot drift.
 */

export interface Oklch {
  l: number
  c: number
  h: number
  a: number
}

export function parseOklch(input: string): Oklch | null {
  const match =
    /^oklch\(\s*([^\s]+)\s+([^\s]+)\s+([^\s/]+)\s*(?:\/\s*([^\s)]+)\s*)?\)$/i.exec(
      input.trim(),
    )
  if (!match) return null

  const num = (raw: string | undefined, percentScale: number): number => {
    if (raw === undefined) return Number.NaN
    return raw.endsWith("%")
      ? (Number.parseFloat(raw) / 100) * percentScale
      : Number.parseFloat(raw)
  }

  const l = num(match[1], 1)
  const c = num(match[2], 0.4)
  const h = num(match[3], 360)
  const a = match[4] === undefined ? 1 : num(match[4], 1)
  if ([l, c, h, a].some(Number.isNaN)) return null
  return { l, c, h, a }
}

const round = (n: number, places: number): number => Number.parseFloat(n.toFixed(places))

export function formatOklch({ l, c, h, a }: Oklch): string {
  const base = `${round(l, 3)} ${round(c, 3)} ${round(h, 1)}`
  return a >= 1 ? `oklch(${base})` : `oklch(${base} / ${round(a * 100, 0)}%)`
}

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n))

/** OKLCH -> sRGB, using the Björn Ottosson OKLab matrices. */
export function toRgb({ l: L, c: C, h: H }: Oklch): { r: number; g: number; b: number } {
  const a = C * Math.cos((H * Math.PI) / 180)
  const b = C * Math.sin((H * Math.PI) / 180)

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const lc = l_ ** 3
  const mc = m_ ** 3
  const sc = s_ ** 3

  return {
    r: clamp01(4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc),
    g: clamp01(-1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc),
    b: clamp01(-0.0041960863 * lc - 0.7034186147 * mc + 1.707614701 * sc),
  }
}

export const toHex = (color: Oklch): string => {
  const { r, g, b } = toRgb(color)
  const hex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, "0")
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** WCAG 2.x contrast ratio. Translucent foregrounds are composited first. */
export function contrastRatio(fg: Oklch, bg: Oklch): number {
  const fgRgb = toRgb(fg)
  const bgRgb = toRgb(bg)
  const composited =
    fg.a >= 1
      ? fgRgb
      : {
          r: fgRgb.r * fg.a + bgRgb.r * (1 - fg.a),
          g: fgRgb.g * fg.a + bgRgb.g * (1 - fg.a),
          b: fgRgb.b * fg.a + bgRgb.b * (1 - fg.a),
        }

  const a = relativeLuminance(composited)
  const b = relativeLuminance(bgRgb)
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}
