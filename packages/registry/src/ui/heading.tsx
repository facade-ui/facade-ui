/**
 * Heading — renders `<h1>`–`<h6>` from a numeric level.
 *
 * Written as an exhaustive switch over literal JSX rather than the obvious
 * `const Tag = \`h${level}\`; <Tag />`. The dynamic-tag form is what
 * `react-hooks/static-components` exists to catch, and suppressing that rule in
 * every section would blunt it everywhere else. This is a few lines longer and
 * needs no suppression at all.
 *
 * a11y: the whole point of the atom. Sections take a `headingLevel` prop and
 * pass it here, so a hero dropped inside an existing page can be `<h2>` while
 * the same component on its own landing page is `<h1>` — without the visual
 * size changing, which `className` controls independently.
 *
 * Dependencies: react, @/lib/types.
 */

import type { ComponentPropsWithoutRef } from "react"

import type { HeadingLevel } from "@/lib/types"

export interface HeadingProps extends ComponentPropsWithoutRef<"h2"> {
  /** 1–6. Reflects the document outline, never the visual size. */
  level: HeadingLevel
}

export function Heading({ level, children, ...props }: HeadingProps) {
  switch (level) {
    case 1:
      return <h1 {...props}>{children}</h1>
    case 2:
      return <h2 {...props}>{children}</h2>
    case 3:
      return <h3 {...props}>{children}</h3>
    case 4:
      return <h4 {...props}>{children}</h4>
    case 5:
      return <h5 {...props}>{children}</h5>
    case 6:
      return <h6 {...props}>{children}</h6>
  }
}
