"use client"

/**
 * PricingTiersMotion — the plan cards with a staggered entrance.
 *
 * Plans arrive in sequence as the section scrolls in.
 *
 * A genuine wrapper: it renders the static `PricingTiers` and only swaps the list
 * slots, so no markup, styling or accessibility behaviour is duplicated. *
 * Dependencies: react, @registry/motion/slots,
 * @registry/sections/pricing-tiers.
 */

import { StaggerList, StaggerListItem } from "@registry/motion/slots"
import { PricingTiers, type PricingTiersProps } from "@registry/sections/pricing-tiers"

export type PricingTiersMotionProps = Omit<PricingTiersProps, "listAs" | "itemAs">

export function PricingTiersMotion(props: PricingTiersMotionProps) {
  return <PricingTiers {...props} listAs={StaggerList} itemAs={StaggerListItem} />
}
