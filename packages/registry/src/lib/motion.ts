/**
 * Motion constants and variants shared by the `motion/` primitives.
 *
 * These numbers mirror the `--facade-duration-*` / `--facade-ease-*` CSS tokens.
 * `motion` needs plain numbers and cubic-bezier arrays, which CSS custom
 * properties cannot provide at render time, so the values are duplicated here —
 * and `motion.test.ts` parses `tokens/globals.css` to prove they stay in sync.
 *
 * a11y: nothing here opts out of reduced motion. `FacadeMotionProvider` sets
 * `reducedMotion="user"` once, which neutralises every variant below.
 *
 * Dependencies: motion (types only).
 */

import type { Transition, Variants } from "motion/react"

/** Milliseconds, matching `--facade-duration-*`. */
export const FACADE_DURATION_MS = {
  fast: 150,
  base: 320,
  slow: 620,
} as const

/** Seconds — the unit `motion` expects. */
export const facadeDuration = {
  fast: FACADE_DURATION_MS.fast / 1000,
  base: FACADE_DURATION_MS.base / 1000,
  slow: FACADE_DURATION_MS.slow / 1000,
} as const

/**
 * Cubic-bezier control points, matching `--facade-ease-*`.
 *
 * Typed as mutable 4-tuples rather than `as const`: motion's `Easing[]` will not
 * accept a readonly tuple, and `as const` widens under spread to a union array.
 */
export type CubicBezier = [number, number, number, number]

export const facadeEase: Record<"out" | "inOut" | "spring", CubicBezier> = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  spring: [0.34, 1.4, 0.64, 1],
}

/** rem, matching `--facade-motion-distance`. Converted to px for transforms. */
export const FACADE_MOTION_DISTANCE_REM = 1
export const FACADE_MOTION_DISTANCE_PX = FACADE_MOTION_DISTANCE_REM * 16

export type FadeDirection = "up" | "down" | "left" | "right" | "none"

/** Only `opacity` and `transform` are animated — never anything that reflows. */
export function offsetFor(direction: FadeDirection, distance = FACADE_MOTION_DISTANCE_PX) {
  switch (direction) {
    case "up":
      return { y: distance, x: 0 }
    case "down":
      return { y: -distance, x: 0 }
    case "left":
      return { x: distance, y: 0 }
    case "right":
      return { x: -distance, y: 0 }
    case "none":
      return { x: 0, y: 0 }
  }
}

export const facadeTransition = (
  duration: number = facadeDuration.base,
  delay = 0,
): Transition => ({
  duration,
  delay,
  ease: facadeEase.out,
})

export function fadeVariants(
  direction: FadeDirection = "up",
  distance?: number,
  duration?: number,
): Variants {
  const offset = offsetFor(direction, distance)
  return {
    hidden: { opacity: 0, ...offset },
    visible: { opacity: 1, x: 0, y: 0, transition: facadeTransition(duration) },
  }
}

/** Container variants for `Stagger`. Children inherit `hidden`/`visible`. */
export function staggerVariants(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  }
}

/** Default viewport config for `Reveal`: fire once, slightly before fully in view. */
export const FACADE_VIEWPORT = { once: true, amount: 0.25, margin: "0px 0px -10% 0px" } as const
