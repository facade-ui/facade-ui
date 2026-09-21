/**
 * Stat — one figure and its label, as a description-list group.
 *
 * DOM order is `<dt>` (label) then `<dd>` (value) because that is the only order
 * a definition list permits; `flex-col-reverse` puts the number on top visually.
 * Reading order and visual order therefore differ by one line, which is the
 * right trade: the value is meaningless to a screen reader without its label
 * arriving first.
 *
 * Must be rendered inside a `<dl>` — `StatsGrid` does that for you.
 *
 * a11y: `value` should include its own unit ("99.9%", "$2.4M"). Pass `srValue`
 * when the display form is an abbreviation a screen reader would mangle.
 *
 * Dependencies: react, @/lib/utils.
 */

import type { ReactNode } from "react"

import { cn } from "@registry/lib/utils"

export interface StatItem {
  /** The figure, including its unit or symbol. */
  value: string
  label: string
  /** Optional sentence of context below the label. */
  description?: string
  /** Spoken form, when `value` is an abbreviation ("1.2K" -> "1200"). */
  srValue?: string
}

export interface StatProps extends StatItem {
  size?: "sm" | "md" | "lg"
  align?: "start" | "center"
  className?: string
  children?: ReactNode
}

const valueSizes = {
  sm: "text-3xl",
  md: "text-display-sm",
  lg: "text-display-md",
} as const

export function Stat({
  value,
  label,
  description,
  srValue,
  size = "md",
  align = "start",
  className,
  children,
}: StatProps) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <dt className="text-muted-foreground text-sm font-medium">
        {label}
        {description ? (
          <span className="text-muted-foreground mt-1 block text-pretty text-sm font-normal">
            {description}
          </span>
        ) : null}
      </dt>
      <dd
        className={cn("text-foreground font-semibold tracking-tight", valueSizes[size])}
      >
        {srValue ? (
          <>
            <span aria-hidden>{value}</span>
            <span className="sr-only">{srValue}</span>
          </>
        ) : (
          value
        )}
        {children}
      </dd>
    </div>
  )
}
