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

/**
 * Enough precision that a hex survives the trip out to OKLCH and back.
 *
 * Measured, not guessed: at three decimals a fifth of all sRGB colours come
 * back as a different hex, some off by six steps in a channel. At five none of
 * them do. Hue keeps three, which is both enough and exactly what the one
 * shipped token with a fractional hue already uses. `parseFloat` drops the
 * trailing zeros, so a token like `oklch(0.145 0 0)` is written back unchanged
 * and only a colour that needs the room takes it.
 */
export function formatOklch({ l, c, h, a }: Oklch): string {
  const base = `${round(l, 5)} ${round(c, 5)} ${round(h, 3)}`
  return a >= 1 ? `oklch(${base})` : `oklch(${base} / ${round(a * 100, 0)}%)`
}

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n))

/**
 * The sRGB transfer function and its inverse, both over 0–1.
 *
 * `toRgb` and `fromRgb` work in **linear** light, because that is what the
 * OKLab matrices are defined against. A hex triplet is gamma-encoded, so every
 * crossing between the two has to go through here. Skipping it is the classic
 * way to end up with a colour that is far too dark.
 */
const encodeSrgb = (v: number): number =>
  v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055

const decodeSrgb = (v: number): number =>
  v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4

/** OKLCH -> linear sRGB, using the Björn Ottosson OKLab matrices. */
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

/** linear sRGB -> OKLCH. The inverse of `toRgb`, for reading a typed hex. */
export function fromRgb({ r, g, b }: { r: number; g: number; b: number }): Oklch {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)

  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bLab = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s

  const c = Math.sqrt(a * a + bLab * bLab)
  // Hue is meaningless at zero chroma, and atan2(0, 0) is not worth arguing
  // with: a grey reads as hue 0.
  const h = c < 1e-6 ? 0 : ((Math.atan2(bLab, a) * 180) / Math.PI + 360) % 360
  return { l: lightness, c, h, a: 1 }
}

const HEX_PATTERN = /^#?([0-9a-f]+)$/i

/** Parses `#rgb`, `#rgba`, `#rrggbb` or `#rrggbbaa`, with or without the hash. */
export function fromHex(input: string): Oklch | null {
  const match = HEX_PATTERN.exec(input.trim())
  if (!match) return null

  const digits = match[1]!
  const hex =
    digits.length === 3 || digits.length === 4
      ? [...digits].map((digit) => digit + digit).join("")
      : digits
  if (hex.length !== 6 && hex.length !== 8) return null

  const byte = (index: number): number =>
    Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16) / 255

  return {
    ...fromRgb({
      r: decodeSrgb(byte(0)),
      g: decodeSrgb(byte(1)),
      b: decodeSrgb(byte(2)),
    }),
    a: hex.length === 8 ? byte(3) : 1,
  }
}

/** OKLCH -> `#rrggbb`, or `#rrggbbaa` when the colour is translucent. */
export const toHex = (color: Oklch): string => {
  const { r, g, b } = toRgb(color)
  const channel = (n: number) =>
    Math.round(clamp01(encodeSrgb(n)) * 255)
      .toString(16)
      .padStart(2, "0")
  const alpha = Math.round(clamp01(color.a) * 255)
    .toString(16)
    .padStart(2, "0")

  return `#${channel(r)}${channel(g)}${channel(b)}${color.a >= 1 ? "" : alpha}`
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  return 0.2126 * decodeSrgb(r) + 0.7152 * decodeSrgb(g) + 0.0722 * decodeSrgb(b)
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
