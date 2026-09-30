/**
 * Eyebrow — the small label that sits above a section heading.
 *
 * The `primary` tone is a tick in the brand colour followed by the label in the
 * foreground colour — the brand is carried by the mark, not by the letters.
 * That is a contrast decision before it is a style one: a brand colour only
 * has to clear 3:1 as a shape (WCAG 1.4.11), where as 14px text it would need
 * 4.5:1, and most brand colours worth having — orange, amber, green, sky — sit
 * between the two. Tinting the text would make the eyebrow the one place a
 * bright theme fails.
 *
 * a11y: never a heading. An eyebrow reads as a category, not as an outline
 * level, and promoting it to `<h3>` above an `<h2>` would invert the document
 * structure for screen-reader users navigating by heading. It renders a `<p>`
 * by default, or a `<span>` when it is already inside flow text. The tick is a
 * pseudo-element with empty content, so it is not in the accessibility tree.
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
  // Inline rather than flex, so the tick follows the text's own alignment and
  // stays with the first line if the label wraps.
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
