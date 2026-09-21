/**
 * Badge — a small inline label for status, category, or a "New" marker.
 *
 * a11y: purely presentational by default. A badge that conveys information not
 * available elsewhere in the surrounding text needs an accessible name of its
 * own — pass `srLabel` for that ("Status: ") rather than relying on colour or
 * position to carry the meaning.
 *
 * Dependencies: class-variance-authority, react, @/lib/utils.
 */

import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentPropsWithoutRef, ReactNode } from "react"

import { cn } from "@/lib/utils"

export const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  ],
  {
    variants: {
      variant: {
        default: "border-transparent bg-secondary text-secondary-foreground",
        primary: "border-transparent bg-primary text-primary-foreground",
        outline: "border-border bg-background text-foreground",
        muted: "border-transparent bg-muted text-muted-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-sm",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
)

export interface BadgeProps
  extends ComponentPropsWithoutRef<"span">,
    VariantProps<typeof badgeVariants> {
  /** Visually hidden prefix, for badges whose meaning is not in the visible text. */
  srLabel?: string
  children?: ReactNode
}

export function Badge({ variant, size, srLabel, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {srLabel ? <span className="sr-only">{srLabel}</span> : null}
      {children}
    </span>
  )
}
