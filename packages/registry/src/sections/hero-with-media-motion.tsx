"use client"

/**
 * HeroWithMediaMotion — the media hero with a staggered entrance.
 *
 * A genuine wrapper: it renders the static `HeroWithMedia` and only swaps the stack
 * slots. Nothing visual and no accessibility decision is duplicated, so the two
 * variants cannot drift apart.
 *
 * The stagger plays on mount rather than on scroll — a hero is above the fold by
 * definition, and waiting for an intersection that already happened would just
 * leave it invisible for a frame.
 *
 * Dependencies: react, @registry/motion/slots,
 * @registry/sections/hero-with-media.
 */

import { StaggerBlock, StaggerStack } from "@registry/motion/slots"
import {
  HeroWithMedia,
  type HeroWithMediaProps,
} from "@registry/sections/hero-with-media"

export type HeroWithMediaMotionProps = Omit<HeroWithMediaProps, "stackAs" | "blockAs">

export function HeroWithMediaMotion(props: HeroWithMediaMotionProps) {
  return <HeroWithMedia {...props} stackAs={StaggerStack} blockAs={StaggerBlock} />
}
