"use client"

/**
 * HeroCenteredMotion — the centred hero with a staggered entrance.
 *
 * A genuine wrapper: it renders the static `HeroCentered` and only swaps the stack
 * slots. Nothing visual and no accessibility decision is duplicated, so the two
 * variants cannot drift apart.
 *
 * The stagger plays on mount rather than on scroll — a hero is above the fold by
 * definition, and waiting for an intersection that already happened would just
 * leave it invisible for a frame.
 *
 * Dependencies: react, @registry/motion/slots,
 * @registry/sections/hero-centered.
 */

import { StaggerBlock, StaggerStack } from "@registry/motion/slots"
import { HeroCentered, type HeroCenteredProps } from "@registry/sections/hero-centered"

export type HeroCenteredMotionProps = Omit<HeroCenteredProps, "stackAs" | "blockAs">

export function HeroCenteredMotion(props: HeroCenteredMotionProps) {
  return <HeroCentered {...props} stackAs={StaggerStack} blockAs={StaggerBlock} />
}
