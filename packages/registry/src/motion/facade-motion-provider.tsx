"use client"

/**
 * FacadeMotionProvider — one `MotionConfig` for the whole app.
 *
 * Mount it once, near the root. Everything in `motion/` assumes it is present
 * but degrades to motion's own defaults if it is not.
 *
 * a11y: `reducedMotion="user"` makes every transform/opacity animation below a
 * no-op for visitors whose OS asks for reduced motion. Combined with the
 * `prefers-reduced-motion` block in `tokens/globals.css`, that covers both the
 * JS and the CSS side.
 *
 * Dependencies: motion, react.
 */

import { MotionConfig } from "motion/react"
import type { ReactNode } from "react"

import { facadeDuration, facadeEase } from "@registry/lib/motion"

export interface FacadeMotionProviderProps {
  children: ReactNode
  /**
   * `"user"` (default) honours the OS setting. `"always"` is useful for taking
   * reduced-motion screenshots; `"never"` should only be used in tests.
   */
  reducedMotion?: "user" | "always" | "never"
  /** Disables `nonce`-less inline style injection in strict CSP setups. */
  nonce?: string
}

export function FacadeMotionProvider({
  children,
  reducedMotion = "user",
  nonce,
}: FacadeMotionProviderProps) {
  return (
    <MotionConfig
      reducedMotion={reducedMotion}
      nonce={nonce}
      transition={{ duration: facadeDuration.base, ease: facadeEase.out }}
    >
      {children}
    </MotionConfig>
  )
}
