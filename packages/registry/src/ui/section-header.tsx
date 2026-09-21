/**
 * SectionHeader — eyebrow, heading, and supporting copy, used by every section.
 *
 * Owns two things sections keep getting wrong: the heading *level* and the id
 * that the section's `aria-labelledby` points at. Both are explicit props, and
 * the id falls back to a slug of the title so the wiring works without the
 * caller having to invent one.
 *
 * a11y: `headingLevel` must reflect the surrounding outline, not the visual
 * size — `size` controls appearance and is completely independent. The eyebrow
 * is a paragraph, never a heading.
 *
 * Dependencies: react, @/lib/types, @/lib/utils, ./eyebrow, ./heading.
 */

import type { ReactNode } from "react"

import type { HeadingLevel } from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Eyebrow } from "@registry/ui/eyebrow"
import { Heading } from "@registry/ui/heading"

export interface SectionHeaderProps {
  title: ReactNode
  /** Small label above the heading. */
  eyebrow?: ReactNode
  /** Supporting copy below the heading. */
  description?: ReactNode
  /** Outline level. Defaults to `2`. Independent of `size`. */
  headingLevel?: HeadingLevel
  /** Visual scale. Defaults to `md`. Independent of `headingLevel`. */
  size?: "sm" | "md" | "lg" | "xl"
  align?: "start" | "center"
  /**
   * The heading's DOM id, for the parent's `aria-labelledby`. Derived from the
   * title when omitted; pass one explicitly if two headings would collide.
   */
  titleId?: string
  /** Buttons or links rendered beside (or under) the heading block. */
  actions?: ReactNode
  className?: string
  children?: ReactNode
}

const headingSizes: Record<NonNullable<SectionHeaderProps["size"]>, string> = {
  sm: "text-2xl font-semibold tracking-tight sm:text-3xl",
  md: "text-display-sm font-semibold text-balance",
  lg: "text-display-md font-semibold text-balance",
  xl: "text-display-lg font-semibold text-balance",
}

const descriptionSizes: Record<NonNullable<SectionHeaderProps["size"]>, string> = {
  sm: "text-base",
  md: "text-base sm:text-lg",
  lg: "text-lg sm:text-xl",
  xl: "text-lg sm:text-xl",
}

/** Derives the heading id the way `SectionHeader` does, for `aria-labelledby`. */
export function sectionTitleId(title: string, explicit?: string): string {
  return explicit ?? slugId(title)
}

export function SectionHeader({
  title,
  eyebrow,
  description,
  headingLevel = 2,
  size = "md",
  align = "start",
  titleId,
  actions,
  className,
  children,
}: SectionHeaderProps) {
  const resolvedId = titleId ?? (typeof title === "string" ? slugId(title) : undefined)

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        actions && "md:flex-row md:items-end md:justify-between md:gap-10",
        className,
      )}
    >
      <div
        className={cn(
          "flex max-w-2xl flex-col gap-4",
          align === "center" && "items-center",
        )}
      >
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <Heading level={headingLevel} id={resolvedId} className={cn(headingSizes[size])}>
          {title}
        </Heading>
        {description ? (
          <p className={cn("text-muted-foreground text-pretty", descriptionSizes[size])}>
            {description}
          </p>
        ) : null}
        {children}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
    </div>
  )
}
