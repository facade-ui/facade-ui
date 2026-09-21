"use client"

/**
 * LogoCloudMotion — the logo wall with a staggered entrance.
 *
 * A genuine wrapper: it renders the static `LogoCloud` and only swaps the list
 * slots for `Stagger` and `StaggerItem`. No markup, no styling and no
 * accessibility behaviour is duplicated, so the two variants cannot drift.
 *
 * a11y: the slots keep rendering `ul`/`li`, so list semantics survive the
 * wrapper, and the whole thing is inert under `prefers-reduced-motion`.
 *
 * Dependencies: react, @registry/motion/stagger, @registry/sections/logo-cloud.
 */

import type { ReactNode } from "react"

import { Stagger, StaggerItem } from "@registry/motion/stagger"
import { LogoCloud, type LogoCloudProps } from "@registry/sections/logo-cloud"

interface SlotProps {
  className?: string
  children?: ReactNode
}

const StaggerList = ({ className, children }: SlotProps) => (
  <Stagger as="ul" stagger={0.05} className={className}>
    {children}
  </Stagger>
)

const StaggerListItem = ({ className, children }: SlotProps) => (
  <StaggerItem as="li" direction="up" distance={12} className={className}>
    {children}
  </StaggerItem>
)

export type LogoCloudMotionProps = Omit<LogoCloudProps, "listAs" | "itemAs">

export function LogoCloudMotion(props: LogoCloudMotionProps) {
  return <LogoCloud {...props} listAs={StaggerList} itemAs={StaggerListItem} />
}
