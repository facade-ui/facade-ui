/**
 * Prose — styles for an article body: headings, paragraphs, lists, links,
 * code, quotes and tables, on the Facade type scale.
 *
 * Wrap rendered markdown or hand-written HTML in it. It styles descendants by
 * element, so the content needs no classes of its own; a class it does set
 * wins, because the rules sit in `:where()`. Not `@tailwindcss/typography`,
 * which would bring a second type scale.
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
        "[:where(&)_h2]:mt-6 [:where(&)_h2]:scroll-mt-24 [:where(&)_h2]:text-2xl [:where(&)_h2]:font-semibold [:where(&)_h2]:tracking-tight",
        "[:where(&)_h3]:mt-2 [:where(&)_h3]:scroll-mt-24 [:where(&)_h3]:text-lg [:where(&)_h3]:font-semibold",
        "[:where(&)_h4]:scroll-mt-24 [:where(&)_h4]:font-semibold",
        "[:where(&)_p]:text-muted-foreground [:where(&)_p]:text-pretty",
        "[:where(&)_ul]:text-muted-foreground [:where(&)_ul]:flex [:where(&)_ul]:list-disc [:where(&)_ul]:flex-col [:where(&)_ul]:gap-2 [:where(&)_ul]:pl-6",
        "[:where(&)_ol]:text-muted-foreground [:where(&)_ol]:flex [:where(&)_ol]:list-decimal [:where(&)_ol]:flex-col [:where(&)_ol]:gap-2 [:where(&)_ol]:pl-6",
        "[:where(&)_code]:bg-muted [:where(&)_code]:rounded [:where(&)_code]:px-1.5 [:where(&)_code]:py-0.5 [:where(&)_code]:font-mono [:where(&)_code]:text-[0.85em]",
        "[:where(&)_pre]:bg-muted [:where(&)_pre]:overflow-x-auto [:where(&)_pre]:rounded-lg [:where(&)_pre]:p-4 [:where(&)_pre]:font-mono [:where(&)_pre]:text-sm [:where(&)_pre]:leading-6",
        "[:where(&)_pre_code]:bg-transparent [:where(&)_pre_code]:p-0 [:where(&)_pre_code]:text-[1em]",
        "[:where(&)_figure_code]:bg-transparent [:where(&)_figure_code]:p-0",
        "[:where(&)_a]:text-foreground [:where(&)_a]:underline [:where(&)_a]:underline-offset-4",
        "[:where(&)_blockquote]:border-border [:where(&)_blockquote]:text-muted-foreground [:where(&)_blockquote]:border-l-2 [:where(&)_blockquote]:pl-4",
        "[:where(&)_table]:w-full [:where(&)_table]:border-collapse [:where(&)_table]:text-left [:where(&)_table]:text-sm",
        "[:where(&)_th]:border-border [:where(&)_th]:border-b [:where(&)_th]:py-2 [:where(&)_th]:pr-4 [:where(&)_th]:font-semibold",
        "[:where(&)_td]:border-border [:where(&)_td]:text-muted-foreground [:where(&)_td]:border-b [:where(&)_td]:py-2 [:where(&)_td]:pr-4",
        "[:where(&)_img]:rounded-lg",
        "[:where(&)_hr]:border-border",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
