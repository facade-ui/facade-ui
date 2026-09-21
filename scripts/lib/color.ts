/**
 * Minimal OKLCH -> sRGB conversion plus WCAG 2.x relative-luminance contrast.
 *
 * Exists so the accessibility claims in the README are verified from the real
 * token values in `globals.css` / `themes.css` rather than asserted by hand.
 * Implements the Björn Ottosson OKLab matrices; no colour library dependency.
 */

export interface Rgb {
  r: number
  g: number
  b: number
  a: number
}

/** Parses `oklch(L C H)` or `oklch(L C H / A%)`. L accepts `0.5` or `50%`. */
export function parseOklch(input: string): Rgb | null {
  const match =
    /^oklch\(\s*([^\s]+)\s+([^\s]+)\s+([^\s/]+)\s*(?:\/\s*([^\s)]+)\s*)?\)$/i.exec(
      input.trim(),
    )
  if (!match) return null

  const num = (raw: string | undefined, scaleIfPercent: number): number => {
    if (raw === undefined) return Number.NaN
    return raw.endsWith("%")
      ? (Number.parseFloat(raw) / 100) * scaleIfPercent
      : Number.parseFloat(raw)
  }

  const L = num(match[1], 1)
  const C = num(match[2], 0.4)
  const H = num(match[3], 360)
  const alphaRaw = match[4]
  const a = alphaRaw === undefined ? 1 : num(alphaRaw, 1)
  if ([L, C, H, a].some(Number.isNaN)) return null

  return {
    ...oklabToSrgb(
      L,
      C * Math.cos((H * Math.PI) / 180),
      C * Math.sin((H * Math.PI) / 180),
    ),
    a,
  }
}

function oklabToSrgb(L: number, a: number, b: number): Omit<Rgb, "a"> {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3

  return {
    r: clamp01(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: clamp01(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: clamp01(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  }
}

const clamp01 = (n: number): number => Math.min(1, Math.max(0, n))

/** Composites a possibly-translucent colour over an opaque backdrop. */
export function flatten(fg: Rgb, bg: Rgb): Rgb {
  if (fg.a >= 1) return fg
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  }
}

function relativeLuminance({ r, g, b }: Rgb): number {
  const lin = (c: number): number =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

/** WCAG 2.x contrast ratio, 1–21. Translucent foregrounds are composited first. */
export function contrastRatio(fg: Rgb, bg: Rgb): number {
  const a = relativeLuminance(flatten(fg, bg))
  const b = relativeLuminance(bg)
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}
