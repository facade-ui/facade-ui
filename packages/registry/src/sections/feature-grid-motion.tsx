"use client"

/**
 * FeatureGridMotion — the feature grid with a staggered entrance.
 *
 * Dependencies: react, @registry/motion/stagger,
 * @registry/sections/feature-grid.
 */

import type { ReactNode } from "react"

import { Stagger, StaggerItem } from "@registry/motion/stagger"
import { FeatureGrid, type FeatureGridProps } from "@registry/sections/feature-grid"

interface SlotProps {
  className?: string
  children?: ReactNode
}

const StaggerList = ({ className, children }: SlotProps) => (
  <Stagger as="ul" className={className}>
    {children}
  </Stagger>
)

const StaggerListItem = ({ className, children }: SlotProps) => (
  <StaggerItem as="li" className={className}>
    {children}
  </StaggerItem>
)

export type FeatureGridMotionProps = Omit<FeatureGridProps, "listAs" | "itemAs">

export function FeatureGridMotion(props: FeatureGridMotionProps) {
  return <FeatureGrid {...props} listAs={StaggerList} itemAs={StaggerListItem} />
}
