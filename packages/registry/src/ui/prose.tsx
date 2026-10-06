/**
 * Prose — styles for an article body: headings, paragraphs, lists, links,
 * code, quotes and tables, on the Facade type scale.
 *
 * Wrap rendered markdown or hand-written HTML in it. It styles descendants by
 * element, so the content needs no classes of its own. Not
 * `@tailwindcss/typography`, which would bring a second type scale.
 *
 * a11y:
 *
 *  - Links are underlined, not only coloured, so they are found without
 *    colour vision (WCAG 1.4.1).
 *  - Text uses `--foreground` and `--muted-foreground`, both checked by
 *    `pnpm contrast`; `--primary` is never text.
 *  - A `<pre>` scrolls sideways when a line is too long. A block that does
 *    needs `tabIndex={0}`, `role="region"` and an `aria-label`, so keyboard
 *    users can scroll it too.
 *
 * Dependencies: react, @registry/lib/utils.
 */

import type { ComponentPropsWithoutRef } from "react"

import { cn } from "@registry/lib/utils"

export interface ProseProps extends ComponentPropsWithoutRef<"div"> {
  /** The element to render. Use `article` when it is the whole article. */
  as?: "div" | "article" | "section"
}

export function Prose({ as: Tag = "div", className, children, ...props }: ProseProps) {
  return (
    <Tag
      className={cn(
        "flex flex-col gap-6",
        "[&_h2]:mt-6 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:mt-2 [&_h3]:scroll-mt-24 [&_h3]:text-lg [&_h3]:font-semibold",
        "[&_h4]:scroll-mt-24 [&_h4]:font-semibold",
        "[&_p]:text-muted-foreground [&_p]:text-pretty",
        "[&_ul]:text-muted-foreground [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-6",
        "[&_ol]:text-muted-foreground [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-2 [&_ol]:pl-6",
        "[&_code]:bg-muted [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]",
        "[&_pre]:bg-muted [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-6",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[1em]",
        "[&_figure_code]:bg-transparent [&_figure_code]:p-0",
        "[&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4",
        "[&_blockquote]:border-border [&_blockquote]:text-muted-foreground [&_blockquote]:border-l-2 [&_blockquote]:pl-4",
        "[&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_table]:text-sm",
        "[&_th]:border-border [&_th]:border-b [&_th]:py-2 [&_th]:pr-4 [&_th]:font-semibold",
        "[&_td]:border-border [&_td]:text-muted-foreground [&_td]:border-b [&_td]:py-2 [&_td]:pr-4",
        "[&_img]:rounded-lg",
        "[&_hr]:border-border",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
