"use client"

/**
 * Motion adapters for the section slot props.
 *
 * Every `-motion` section variant needs the same four wrappers, differing only
 * in the tag they render. Keeping them here means a motion variant is genuinely
 * three lines of composition, and that a change to the choreography — timing,
 * direction, travel — happens once rather than in a dozen near-identical files.
 *
 * The tag matters: `StaggerList` renders a `ul` and `StaggerListItem` an `li`,
 * so wrapping a list in motion never costs it its list semantics.
 *
 * Dependencies: react, @registry/motion/stagger.
 */

import type { ReactNode } from "react"

import { Stagger, StaggerItem } from "@registry/motion/stagger"

export interface MotionSlotProps {
  className?: string
  children?: ReactNode
}

/** Drop-in for a section's `listAs`. Renders a `<ul>`. */
export function StaggerList({ className, children }: MotionSlotProps) {
  return (
    <Stagger as="ul" className={className}>
      {children}
    </Stagger>
  )
}

/** Drop-in for a section's `itemAs`. Renders an `<li>`. */
export function StaggerListItem({ className, children }: MotionSlotProps) {
  return (
    <StaggerItem as="li" className={className}>
      {children}
    </StaggerItem>
  )
}

/**
 * Drop-in for a section's `stackAs`. Renders a `<div>` and plays on mount
 * rather than on scroll, because a hero is above the fold by definition.
 */
export function StaggerStack({ className, children }: MotionSlotProps) {
  return (
    <Stagger trigger="mount" stagger={0.07} className={className}>
      {children}
    </Stagger>
  )
}

/** Drop-in for a section's `blockAs`. Renders a `<div>`. */
export function StaggerBlock({ className, children }: MotionSlotProps) {
  return <StaggerItem className={className}>{children}</StaggerItem>
}
