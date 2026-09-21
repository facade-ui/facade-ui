"use client"

/**
 * FaqAccordionMotion — the FAQ with its rows revealed as they scroll in.
 *
 * The open/close animation is *not* what this adds: Base UI plus the CSS height
 * transition already handles that, without JavaScript. What the motion variant
 * contributes is the entrance of the list itself.
 *
 * Dependencies: react, @registry/motion/slots,
 * @registry/sections/faq-accordion.
 */

import type { ReactNode } from "react"

import { StaggerBlock } from "@registry/motion/slots"
import { Stagger } from "@registry/motion/stagger"
import { FaqAccordion, type FaqAccordionProps } from "@registry/sections/faq-accordion"

function RevealStack({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  return (
    <Stagger className={className} stagger={0.05}>
      {children}
    </Stagger>
  )
}

export type FaqAccordionMotionProps = Omit<FaqAccordionProps, "listAs" | "itemAs">

export function FaqAccordionMotion(props: FaqAccordionMotionProps) {
  return <FaqAccordion {...props} listAs={RevealStack} itemAs={StaggerBlock} />
}
