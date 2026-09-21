"use client"

/**
 * Collapse — animated disclosure for FAQ panels and the mobile nav drawer.
 *
 * The one deliberate exception to the "transform and opacity only" rule: a
 * disclosure has to animate `height`, because the size change *is* the content of
 * the interaction. It is user-initiated and never runs on load, so it cannot
 * contribute to CLS. Everything else in `motion/` stays on the compositor.
 *
 * `Collapse` is presentation only — it renders no button and manages no state.
 * Pair it with Base UI's Accordion or Collapsible, which own the ARIA wiring.
 *
 * a11y: when closed the panel is unmounted (or `hidden`, with `keepMounted`), so
 * its contents stay out of the tab order and out of the accessibility tree.
 *
 * Dependencies: motion, react, @/lib/motion, @/lib/utils.
 */

import { AnimatePresence, motion } from "motion/react"
import type { ReactNode } from "react"

import { facadeDuration, facadeEase } from "@registry/lib/motion"
import { cn } from "@registry/lib/utils"

export interface CollapseProps {
  open: boolean
  children: ReactNode
  /** Seconds. Defaults to `--facade-duration-fast`, which suits short panels. */
  duration?: number
  className?: string
  /**
   * Keep the panel mounted and hide it with `hidden` instead of removing it.
   * Costs nothing visually but lets browser find-in-page reach the content.
   */
  keepMounted?: boolean
  /** Forwarded to the panel element — set this to the trigger's `aria-controls`. */
  id?: string
}

const transition = (duration: number) => ({ duration, ease: facadeEase.inOut })

export function Collapse({
  open,
  children,
  duration = facadeDuration.fast,
  className,
  keepMounted = false,
  id,
}: CollapseProps) {
  if (keepMounted) {
    return (
      <motion.div
        id={id}
        hidden={!open}
        className={cn("overflow-hidden", className)}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={transition(duration)}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          id={id}
          className={cn("overflow-hidden", className)}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={transition(duration)}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
