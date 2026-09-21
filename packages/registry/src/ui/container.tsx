/**
 * Container — the horizontal measure every section sits inside.
 *
 * Width comes from `--facade-container-max` and the gutter from
 * `--facade-container-gutter`, so retuning the whole site's measure is a
 * one-token change rather than a find-and-replace across sections.
 *
 * a11y: renders a plain wrapper by default. Pass `as` when the container *is*
 * the landmark (`header`, `footer`, `nav`, `main`) rather than nesting one
 * inside another element that already carries the role.
 *
 * Dependencies: react, @/lib/utils.
 */

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"

import { cn } from "@/lib/utils"

export type ContainerElement = "div" | "section" | "header" | "footer" | "nav" | "main"

export interface ContainerProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  as?: ContainerElement
  /** `lg` is `--facade-container-max`. `sm`/`md` narrow it for prose. */
  size?: "sm" | "md" | "lg" | "full"
  /** Set `false` to remove the horizontal gutter, e.g. for a full-bleed child. */
  gutter?: boolean
  children?: ReactNode
}

const sizes: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-facade",
  full: "max-w-none",
}

export function Container({
  as = "div",
  size = "lg",
  gutter = true,
  className,
  children,
  ...props
}: ContainerProps) {
  const Component = as as ElementType

  return (
    <Component
      className={cn("mx-auto w-full", sizes[size], gutter && "px-gutter sm:px-8", className)}
      {...props}
    >
      {children}
    </Component>
  )
}
