"use client"

/**
 * FeatureGridMotion — the feature grid with a staggered entrance.
 *
 * Dependencies: react, @registry/motion/slots,
 * @registry/sections/feature-grid.
 */

import { StaggerList, StaggerListItem } from "@registry/motion/slots"
import { FeatureGrid, type FeatureGridProps } from "@registry/sections/feature-grid"

export type FeatureGridMotionProps = Omit<FeatureGridProps, "listAs" | "itemAs">

export function FeatureGridMotion(props: FeatureGridMotionProps) {
  return <FeatureGrid {...props} listAs={StaggerList} itemAs={StaggerListItem} />
}
