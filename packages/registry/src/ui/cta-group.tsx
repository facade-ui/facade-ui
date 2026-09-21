/**
 * CtaGroup — renders a list of calls to action as buttons.
 *
 * Every action is an anchor, because a marketing CTA navigates. That keeps the
 * group renderable from a server component and preserves middle-click, "open in
 * new tab", and the browser's own link affordances, none of which survive a
 * `<button onClick={router.push}>`.
 *
 * Pass `link={Link}` to route through `next/link` (or any router's link) without
 * this file importing a framework.
 *
 * a11y: the first action defaults to `primary` and the rest to `outline`, so the
 * primary path is never ambiguous. `external` adds `rel="noopener noreferrer"`
 * plus a visually hidden "(opens in a new tab)" so the behaviour is announced.
 *
 * Dependencies: react, @/lib/types, @/lib/utils, ./button.
 */

import type { ElementType } from "react"

import type { CtaItem, LinkComponent } from "@/lib/types"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

export interface CtaGroupProps {
  items: CtaItem[]
  /** Drop-in for `next/link`. Defaults to `"a"`. */
  link?: LinkComponent
  size?: "sm" | "md" | "lg"
  align?: "start" | "center" | "end"
  /** Stack full-width on small screens — the usual choice inside a hero. */
  stackOnMobile?: boolean
  className?: string
}

const alignment = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
} as const

export function CtaGroup({
  items,
  link,
  size = "md",
  align = "start",
  stackOnMobile = false,
  className,
}: CtaGroupProps) {
  if (items.length === 0) return null
  const Link = (link ?? "a") as ElementType

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        alignment[align],
        stackOnMobile && "flex-col sm:flex-row",
        className,
      )}
    >
      {items.map((item, index) => {
        const variant = item.variant ?? (index === 0 ? "primary" : "outline")
        return (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            aria-label={item["aria-label"]}
            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={cn(
              buttonVariants({ variant, size }),
              stackOnMobile && "w-full sm:w-auto",
            )}
          >
            {item.label}
            {item.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
          </Link>
        )
      })}
    </div>
  )
}
