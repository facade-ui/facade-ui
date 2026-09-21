"use client"

/**
 * CardListMotion — the card grid with a staggered entrance.
 *
 * Cards arrive in sequence as the grid scrolls in.
 *
 * A genuine wrapper: it renders the static `CardList` and only swaps the list
 * slots, so no markup, styling or accessibility behaviour is duplicated. *
 * Dependencies: react, @registry/motion/slots,
 * @registry/sections/card-list.
 */

import { StaggerList, StaggerListItem } from "@registry/motion/slots"
import { CardList, type CardListProps } from "@registry/sections/card-list"

export type CardListMotionProps = Omit<CardListProps, "listAs" | "itemAs">

export function CardListMotion(props: CardListMotionProps) {
  return <CardList {...props} listAs={StaggerList} itemAs={StaggerListItem} />
}
