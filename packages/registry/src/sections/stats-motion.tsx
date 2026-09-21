"use client"

/**
 * StatsMotion — the figures revealed in sequence as they scroll in.
 *
 * The slots render `dl`/`div` rather than `ul`/`li`, because a stats row is a
 * description list. That is why this file does not reuse `StaggerList`.
 *
 * Dependencies: react, @registry/motion/slots, @registry/motion/stagger,
 * @registry/sections/stats.
 */

import type { ReactNode } from "react"

import { StaggerBlock } from "@registry/motion/slots"
import { Stagger } from "@registry/motion/stagger"
import { Stats, type StatsProps } from "@registry/sections/stats"

function StaggerDl({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  return (
    <Stagger as="dl" className={className}>
      {children}
    </Stagger>
  )
}

export type StatsMotionProps = Omit<StatsProps, "listAs" | "itemAs">

export function StatsMotion(props: StatsMotionProps) {
  return <Stats {...props} listAs={StaggerDl} itemAs={StaggerBlock} />
}
