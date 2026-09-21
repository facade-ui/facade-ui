"use client"

/**
 * HeroSplitMotion — the split hero with a staggered entrance.
 *
 * A genuine wrapper: it renders the static `HeroSplit` and only swaps the stack
 * slots. Nothing visual and no accessibility decision is duplicated, so the two
 * variants cannot drift apart.
 *
 * The stagger plays on mount rather than on scroll — a hero is above the fold by
 * definition, and waiting for an intersection that already happened would just
 * leave it invisible for a frame.
 *
 * Dependencies: react, @registry/motion/slots,
 * @registry/sections/hero-split.
 */

import { StaggerBlock, StaggerStack } from "@registry/motion/slots"
import { HeroSplit, type HeroSplitProps } from "@registry/sections/hero-split"

export type HeroSplitMotionProps = Omit<HeroSplitProps, "stackAs" | "blockAs">

export function HeroSplitMotion(props: HeroSplitMotionProps) {
  return <HeroSplit {...props} stackAs={StaggerStack} blockAs={StaggerBlock} />
}
