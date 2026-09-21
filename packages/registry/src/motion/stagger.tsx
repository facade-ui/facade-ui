"use client"

/**
 * Stagger — a container that reveals its `StaggerItem` children in sequence.
 *
 * Split into two components on purpose: the container owns the timing, each item
 * owns its own offset, and neither needs to know how many siblings exist. Use
 * `StaggerItem` for every direct child you want animated; unwrapped children
 * simply render immediately.
 *
 *   <Stagger as="ul">
 *     {items.map((item) => <StaggerItem key={item.id} as="li">…</StaggerItem>)}
 *   </Stagger>
 *
 * a11y: the container renders whatever tag you pass, so `ul`/`li` semantics
 * survive the wrapper. Opacity/transform only.
 *
 * Dependencies: motion, react, @/lib/motion, @/lib/utils.
 */

import { motion } from "motion/react"
import type { ReactNode } from "react"

import {
  FACADE_VIEWPORT,
  facadeDuration,
  fadeVariants,
  staggerVariants,
  type FadeDirection,
} from "@/lib/motion"
import { cn } from "@/lib/utils"
import type { MotionTag } from "./fade-in"

export interface StaggerProps {
  children: ReactNode
  /** Seconds between each child. Default `0.08`. */
  stagger?: number
  /** Seconds before the first child starts. Default `0`. */
  delayChildren?: number
  as?: MotionTag
  className?: string
  /** `"view"` (default) waits for scroll; `"mount"` plays immediately. */
  trigger?: "view" | "mount"
  repeat?: boolean
  amount?: number
}

export function Stagger({
  children,
  stagger = 0.08,
  delayChildren = 0,
  as = "div",
  className,
  trigger = "view",
  repeat = false,
  amount = FACADE_VIEWPORT.amount,
}: StaggerProps) {
  const Component = motion[as]
  const activation =
    trigger === "mount"
      ? ({ animate: "visible" } as const)
      : ({
          whileInView: "visible",
          viewport: { once: !repeat, amount, margin: FACADE_VIEWPORT.margin },
        } as const)

  return (
    <Component
      className={cn(className)}
      initial="hidden"
      variants={staggerVariants(stagger, delayChildren)}
      {...activation}
    >
      {children}
    </Component>
  )
}

export interface StaggerItemProps {
  children: ReactNode
  direction?: FadeDirection
  duration?: number
  distance?: number
  as?: MotionTag
  className?: string
}

export function StaggerItem({
  children,
  direction = "up",
  duration = facadeDuration.base,
  distance,
  as = "div",
  className,
}: StaggerItemProps) {
  const Component = motion[as]

  return (
    <Component className={cn(className)} variants={fadeVariants(direction, distance, duration)}>
      {children}
    </Component>
  )
}
