/**
 * Typographic wrapper for the hand-written guide pages.
 *
 * Deliberately not `@tailwindcss/typography`: the guides need to match the
 * registry's own token scale exactly, and a second, parallel type system is how
 * a design system's docs start to look unlike the design system.
 */

import type { ReactNode } from "react"

import { cn } from "@registry/lib/utils"

export function Prose({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-6 pb-20",
        "[&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mt-2 [&_h3]:text-lg [&_h3]:font-semibold",
        "[&_p]:text-muted-foreground [&_p]:text-pretty",
        "[&_ul]:text-muted-foreground [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-6",
        "[&_ol]:text-muted-foreground [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-6",
        "[&_code]:bg-muted [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]",
        "[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4",
        "[&_figure_code]:bg-transparent [&_figure_code]:p-0",
        className,
      )}
    >
      {children}
    </div>
  )
}
