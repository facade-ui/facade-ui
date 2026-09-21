"use client"

/**
 * FeatureRowsMotion — alternating feature rows, each revealed as it scrolls in.
 *
 * Dependencies: react, @registry/motion/slots,
 * @registry/sections/feature-rows.
 */

import { StaggerList, StaggerListItem } from "@registry/motion/slots"
import { FeatureRows, type FeatureRowsProps } from "@registry/sections/feature-rows"

export type FeatureRowsMotionProps = Omit<FeatureRowsProps, "listAs" | "itemAs">

export function FeatureRowsMotion(props: FeatureRowsMotionProps) {
  return <FeatureRows {...props} listAs={StaggerList} itemAs={StaggerListItem} />
}
