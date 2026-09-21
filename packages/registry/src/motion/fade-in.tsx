"use client"

/**
 * FadeIn — the base entrance primitive: opacity plus a short translate.
 *
 * Plays on mount. For "play when scrolled into view" use `Reveal`; for lists use
 * `Stagger` + `StaggerItem`, which drive their children through variants instead.
 *
 * a11y: animates only `opacity` and `transform`, so it can never shift layout or
 * trigger CLS. Neutralised entirely under `FacadeMotionProvider`'s
 * `reducedMotion="user"`.
 *
 * Dependencies: motion, react, @/lib/motion, @/lib/utils.
 */

import { motion } from "motion/react"
import type { ReactNode } from "react"

import { facadeDuration, fadeVariants, type FadeDirection } from "@registry/lib/motion"
import { cn } from "@registry/lib/utils"

/** Tags `FadeIn`, `Reveal` and `Stagger` can render as. */
export type MotionTag =
  | "div"
  | "span"
  | "p"
  | "section"
  | "article"
  | "header"
  | "footer"
  | "ul"
  | "ol"
  | "li"
  | "figure"

export interface FadeInProps {
  children: ReactNode
  /** Direction the element travels *from*. `"none"` fades in place. */
  direction?: FadeDirection
  /** Seconds. Defaults to `--facade-duration-base`. */
  duration?: number
  /** Seconds. */
  delay?: number
  /** Travel distance in px. Defaults to `--facade-motion-distance` (16px). */
  distance?: number
  as?: MotionTag
  className?: string
}

export function FadeIn({
  children,
  direction = "up",
  duration = facadeDuration.base,
  delay = 0,
  distance,
  as = "div",
  className,
}: FadeInProps) {
  const Component = motion[as]
  const variants = fadeVariants(direction, distance, duration)

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </Component>
  )
}
