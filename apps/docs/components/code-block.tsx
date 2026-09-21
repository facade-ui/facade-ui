/**
 * Syntax-highlighted code, rendered on the server with Shiki.
 *
 * Dual themes are emitted as CSS variables and swapped by the `.dark` class (see
 * globals.css), so the code sample follows the site's theme toggle rather than
 * the OS setting.
 *
 * a11y: the `<pre>` is focusable and labelled, because a code block that
 * overflows horizontally is a scroll container — and a scroll container that
 * cannot be reached by keyboard traps content for keyboard-only users.
 */

import { codeToHtml } from "shiki"

import { CopyButton } from "./copy-button"
import { cn } from "@registry/lib/utils"

export interface CodeBlockProps {
  code: string
  lang?: string
  /** Shown in the header strip, usually the install path. */
  filename?: string
  className?: string
  /** Caps the height and makes the block scroll. */
  maxHeight?: string
}

export async function CodeBlock({
  code,
  lang = "tsx",
  filename,
  className,
  maxHeight,
}: CodeBlockProps) {
  const html = await codeToHtml(code.trimEnd(), {
    lang,
    // The plain GitHub themes fail WCAG AA on comments and several token
    // colours — caught by the axe pass over the docs pages. The high-contrast
    // variants keep the familiar look and clear 4.5:1.
    themes: { light: "github-light-high-contrast", dark: "github-dark-high-contrast" },
    defaultColor: false,
  })

  return (
    <figure className={cn("bg-card overflow-hidden rounded-lg border", className)}>
      <figcaption className="border-border bg-muted/40 flex items-center justify-between gap-3 border-b px-4 py-2">
        <span className="text-muted-foreground truncate font-mono text-xs">
          {filename ?? lang}
        </span>
        <CopyButton value={code} label={filename ? `Copy ${filename}` : "Copy code"} />
      </figcaption>
      <div
        tabIndex={0}
        role="region"
        aria-label={filename ? `${filename} source` : `${lang} code sample`}
        className="focus-visible:ring-ring overflow-auto text-sm focus-visible:outline-none focus-visible:ring-2 [&_pre]:!bg-transparent [&_pre]:p-4"
        style={maxHeight ? { maxHeight } : undefined}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  )
}
