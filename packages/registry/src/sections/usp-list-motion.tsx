"use client"

/**
 * UspListMotion — the USP strip with a staggered entrance.
 *
 * Swaps only the list slots on the static `UspList`; everything visual and every
 * accessibility decision stays in that one file.
 *
 * Dependencies: react, @registry/motion/slots, @registry/sections/usp-list.
 */

import { StaggerList, StaggerListItem } from "@registry/motion/slots"
import { UspList, type UspListProps } from "@registry/sections/usp-list"

export type UspListMotionProps = Omit<UspListProps, "listAs" | "itemAs">

export function UspListMotion(props: UspListMotionProps) {
  return <UspList {...props} listAs={StaggerList} itemAs={StaggerListItem} />
}
