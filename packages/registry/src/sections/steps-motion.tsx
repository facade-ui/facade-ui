"use client"

/**
 * StepsMotion — the numbered sequence with a staggered entrance.
 *
 * Steps arrive in order, which is the one place a stagger carries meaning rather than decoration.
 *
 * A genuine wrapper: it renders the static `Steps` and only swaps the list
 * slots, so no markup, styling or accessibility behaviour is duplicated.
 *
 * The list slot renders an `ol` rather than a `ul`, because the sequence is the
 * content — which is also why the stagger belongs here at all. The item slot
 * still renders an `li`: an `ol` may only contain list items, and a `div` there
 * is invalid markup that axe reports as `list`.
 *
 * Dependencies: react, @registry/motion/slots, @registry/motion/stagger,
 * @registry/sections/steps.
 */

import type { ReactNode } from "react"

import { StaggerListItem } from "@registry/motion/slots"
import { Stagger } from "@registry/motion/stagger"
import { Steps, type StepsProps } from "@registry/sections/steps"

function StaggerOl({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  return (
    <Stagger as="ol" className={className}>
      {children}
    </Stagger>
  )
}

export type StepsMotionProps = Omit<StepsProps, "listAs" | "itemAs">

export function StepsMotion(props: StepsMotionProps) {
  return <Steps {...props} listAs={StaggerOl} itemAs={StaggerListItem} />
}
