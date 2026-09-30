/**
 * Eyebrow — the small label that sits above a section heading.
 *
 * The `primary` tone puts the brand colour in a tick, not in the letters: a
 * brand colour need only clear 3:1 as a shape, but 4.5:1 as 14px text.
 *
 * a11y: never a heading. An eyebrow reads as a category, not as an outline
 * level, and promoting it to `<h3>` above an `<h2>` would invert the document
 * structure for screen-reader users navigating by heading. It renders a `<p>`
 * by default, or a `<span>` when it is already inside flow text. The tick is a
 * pseudo-element, so it is not announced.
 *
 * Dependencies: react, @/lib/utils.
 */

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react"

import { cn } from "@registry/lib/utils"

export interface EyebrowProps extends Omit<ComponentPropsWithoutRef<"p">, "children"> {
  as?: "p" | "span" | "div"
  /** `muted` is the default; `primary` leads with a tick in the brand colour. */
  tone?: "muted" | "primary" | "foreground"
  children?: ReactNode
}

const tones: Record<NonNullable<EyebrowProps["tone"]>, string> = {
  muted: "text-muted-foreground",
  // Inline, so the tick follows the text's alignment and its first line.
  primary:
    "text-foreground before:bg-primary before:mr-[0.75em] before:inline-block before:size-[0.6em] before:rounded-[0.125em] before:content-['']",
  foreground: "text-foreground",
}

export function Eyebrow({
  as = "p",
  tone = "muted",
  className,
  children,
  ...props
}: EyebrowProps) {
  const Component = as as ElementType

  return (
    <Component
      className={cn(
        "text-sm font-semibold uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
