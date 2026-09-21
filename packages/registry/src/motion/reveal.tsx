"use client"

/**
 * Reveal — entrance animation triggered when the element scrolls into view.
 *
 * Fires once and stays visible. The `once` default matters: re-animating on every
 * scroll pass is the single most common way marketing motion becomes annoying,
 * and it also defeats browser find-in-page.
 *
 * a11y: opacity/transform only. The element is in the DOM and fully readable by
 * assistive tech before the animation runs — nothing is gated behind the
 * intersection observer.
 *
 * Dependencies: motion, react, @/lib/motion, @/lib/utils.
 */

import { motion } from "motion/react"
import type { ReactNode } from "react"

import {
  FACADE_VIEWPORT,
  facadeDuration,
  fadeVariants,
  type FadeDirection,
} from "@registry/lib/motion"
import { cn } from "@registry/lib/utils"
import type { MotionTag } from "@registry/motion/fade-in"

export interface RevealProps {
  children: ReactNode
  direction?: FadeDirection
  duration?: number
  delay?: number
  distance?: number
  as?: MotionTag
  className?: string
  /** Replay every time the element re-enters the viewport. Default `false`. */
  repeat?: boolean
  /** Fraction of the element that must be visible to trigger. Default `0.25`. */
  amount?: number
}

export function Reveal({
  children,
  direction = "up",
  duration = facadeDuration.base,
  delay = 0,
  distance,
  as = "div",
  className,
  repeat = false,
  amount = FACADE_VIEWPORT.amount,
}: RevealProps) {
  const Component = motion[as]

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, amount, margin: FACADE_VIEWPORT.margin }}
      variants={fadeVariants(direction, distance, duration)}
      transition={{ delay }}
    >
      {children}
    </Component>
  )
}
