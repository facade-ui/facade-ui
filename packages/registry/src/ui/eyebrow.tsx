/**
 * Eyebrow — the small label that sits above a section heading.
 *
 * a11y: never a heading. An eyebrow reads as a category, not as an outline
 * level, and promoting it to `<h3>` above an `<h2>` would invert the document
 * structure for screen-reader users navigating by heading. It renders a `<p>`
 * by default, or a `<span>` when it is already inside flow text.
 *
 * Dependencies: react, @/lib/utils.
 */

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"

import { cn } from "@/lib/utils"

export interface EyebrowProps extends Omit<ComponentPropsWithoutRef<"p">, "children"> {
  as?: "p" | "span" | "div"
  /** `muted` is the default; `primary` tints it with the brand colour. */
  tone?: "muted" | "primary" | "foreground"
  children?: ReactNode
}

const tones: Record<NonNullable<EyebrowProps["tone"]>, string> = {
  muted: "text-muted-foreground",
  primary: "text-primary",
  foreground: "text-foreground",
}

export function Eyebrow({ as = "p", tone = "muted", className, children, ...props }: EyebrowProps) {
  const Component = as as ElementType

  return (
    <Component
      className={cn(
        "text-sm font-semibold tracking-[0.12em] uppercase",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
