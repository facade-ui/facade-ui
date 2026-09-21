"use client"

/**
 * TeamMotion — the team grid with a staggered entrance.
 *
 * People arrive one after another as the grid scrolls in.
 *
 * A genuine wrapper: it renders the static `Team` and only swaps the list
 * slots, so no markup, styling or accessibility behaviour is duplicated. *
 * Dependencies: react, @registry/motion/slots,
 * @registry/sections/team.
 */

import { StaggerList, StaggerListItem } from "@registry/motion/slots"
import { Team, type TeamProps } from "@registry/sections/team"

export type TeamMotionProps = Omit<TeamProps, "listAs" | "itemAs">

export function TeamMotion(props: TeamMotionProps) {
  return <Team {...props} listAs={StaggerList} itemAs={StaggerListItem} />
}
