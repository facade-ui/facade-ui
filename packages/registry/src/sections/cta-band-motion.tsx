"use client"

/**
 * CtaBandMotion — the closing CTA revealed as it scrolls into view.
 *
 * Unlike the heroes, this stack plays on scroll rather than on mount, because a
 * closing band is below the fold by definition.
 *
 * Dependencies: react, @registry/motion/slots, @registry/motion/stagger,
 * @registry/sections/cta-band.
 */

import type { ReactNode } from "react"

import { StaggerBlock } from "@registry/motion/slots"
import { Stagger } from "@registry/motion/stagger"
import { CtaBand, type CtaBandProps } from "@registry/sections/cta-band"

function RevealStack({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  return (
    <Stagger className={className} stagger={0.08}>
      {children}
    </Stagger>
  )
}

export type CtaBandMotionProps = Omit<CtaBandProps, "stackAs" | "blockAs">

export function CtaBandMotion(props: CtaBandMotionProps) {
  return <CtaBand {...props} stackAs={RevealStack} blockAs={StaggerBlock} />
}
