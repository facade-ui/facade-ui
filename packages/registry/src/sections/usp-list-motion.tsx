"use client"

/**
 * UspListMotion — the USP strip with a staggered entrance.
 *
 * Swaps only the list slots on the static `UspList`; everything visual and every
 * accessibility decision stays in that one file.
 *
 * Dependencies: react, @registry/motion/stagger, @registry/sections/usp-list.
 */

import type { ReactNode } from "react"

import { Stagger, StaggerItem } from "@registry/motion/stagger"
import { UspList, type UspListProps } from "@registry/sections/usp-list"

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

export type UspListMotionProps = Omit<UspListProps, "listAs" | "itemAs">

export function UspListMotion(props: UspListMotionProps) {
  return <UspList {...props} listAs={StaggerList} itemAs={StaggerListItem} />
}
