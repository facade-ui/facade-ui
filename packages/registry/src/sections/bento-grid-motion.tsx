"use client"

/**
 * BentoGridMotion — the bento mosaic with a staggered entrance.
 *
 * Dependencies: react, @registry/motion/slots, @registry/sections/bento-grid.
 */

import { StaggerList, StaggerListItem } from "@registry/motion/slots"
import { BentoGrid, type BentoGridProps } from "@registry/sections/bento-grid"

export type BentoGridMotionProps = Omit<BentoGridProps, "listAs" | "itemAs">

export function BentoGridMotion(props: BentoGridMotionProps) {
  return <BentoGrid {...props} listAs={StaggerList} itemAs={StaggerListItem} />
}
