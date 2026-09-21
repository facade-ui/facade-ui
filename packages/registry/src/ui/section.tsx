/**
 * Section — the outer band every Facade section renders.
 *
 * Centralises the three things that are easy to get wrong and tedious to repeat:
 * the landmark element, the vertical rhythm token, and the `aria-labelledby`
 * link to the section's own heading.
 *
 * a11y: a `<section>` only becomes a landmark once it has an accessible name, so
 * this always pairs `aria-labelledby` with the id `SectionHeader` puts on the
 * heading. An unnamed band should be rendered `as="div"` instead, which keeps it
 * out of the landmark list rather than adding a nameless region.
 *
 * Dependencies: react, @/lib/types, @/lib/utils.
 */

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"

import type { SectionBaseProps } from "@/lib/types"
import { cn } from "@/lib/utils"

export interface SectionProps
  extends Omit<ComponentPropsWithoutRef<"section">, "children">,
    Pick<SectionBaseProps, "as" | "spacing"> {
  /** Id of the heading that names this section. Omit only when `as="div"`. */
  labelledBy?: string
  children?: ReactNode
}

const spacings = {
  none: "",
  sm: "py-section-sm",
  md: "py-section",
  lg: "py-section-lg",
} as const

export function Section({
  as = "section",
  spacing = "md",
  labelledBy,
  className,
  children,
  ...props
}: SectionProps) {
  const Component = as as ElementType
  const nameable = as === "section" || as === "article" || as === "aside"

  return (
    <Component
      aria-labelledby={nameable ? labelledBy : undefined}
      className={cn("relative w-full", spacings[spacing], className)}
      {...props}
    >
      {children}
    </Component>
  )
}
