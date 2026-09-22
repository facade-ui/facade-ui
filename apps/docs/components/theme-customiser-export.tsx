"use client"

/**
 * The reference side of the customiser: the full contrast results for both
 * modes, and the CSS to paste into a project.
 *
 * This lives on a page rather than in the panel because it is the part you read
 * rather than the part you drag. The panel is narrow, always on top of
 * something, and scored for the mode you are looking at; a table of fourteen
 * pairs in two modes wants a page's width and the reader's attention.
 *
 * a11y: real tables with row headers and captions; pass/fail is an icon plus a
 * word, never colour alone; the scrolling code block is focusable and labelled,
 * because a scroll container a keyboard user cannot reach traps its own
 * content (WCAG 2.1.1).
 */

import { CheckIcon, XIcon } from "lucide-react"

import palettes from "@/.generated/palettes.json"
import { customThemeCss, useCustomTheme, type CustomTheme } from "@/lib/custom-theme"
import { contrastRatio } from "@/lib/oklch"
import { checkPalette, type Palette } from "@/lib/theme-tokens"
import { CopyButton } from "./copy-button"
import { cn } from "@registry/lib/utils"

const shipped = palettes as Record<string, Palette>

// Nothing customised yet still has something worth reading: the shipped
// default, scored by the very same checks.
const NEUTRAL: CustomTheme = {
  light: shipped["neutral-light"]!,
  dark: shipped["neutral-dark"]!,
}

function ContrastTable({ palette, mode }: { palette: Palette; mode: "light" | "dark" }) {
  const checks = checkPalette(palette, contrastRatio)

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">Contrast results for the {mode} palette</caption>
        <thead className="bg-muted/40">
          <tr>
            <th scope="col" className="px-3 py-2 font-medium">
              Pair
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Ratio
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Result
            </th>
          </tr>
        </thead>
        <tbody>
          {checks.map((check) => (
            <tr key={`${check.fg}-${check.bg}`} className="border-t">
              <th scope="row" className="px-3 py-2 text-left font-normal">
                {check.label}
              </th>
              <td className="px-3 py-2 font-mono text-xs">
                {check.ratio.toFixed(2)}:1
                <span className="text-muted-foreground"> (min {check.min})</span>
              </td>
              <td className="px-3 py-2">
                {/* Icon plus text: never colour alone. */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-xs font-medium",
                    check.passes ? "text-foreground" : "text-destructive",
                  )}
                >
                  {check.passes ? (
                    <CheckIcon aria-hidden className="size-4" />
                  ) : (
                    <XIcon aria-hidden className="size-4" />
                  )}
                  {check.passes ? "Passes" : "Fails"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ThemeCustomiserExport() {
  const [stored] = useCustomTheme()
  const theme = stored ?? NEUTRAL
  const css = customThemeCss(theme)

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="customiser-checks" className="flex flex-col gap-3">
        <h2 id="customiser-checks" className="text-lg font-semibold">
          Contrast
        </h2>
        <p className="text-muted-foreground text-pretty text-sm">
          {stored
            ? "Your palette, against the same pairs and thresholds "
            : "The shipped neutral palette, against the same pairs and thresholds "}
          <code>scripts/check-contrast.ts</code> enforces in CI.
        </p>
        {(["light", "dark"] as const).map((mode) => (
          <section key={mode} aria-labelledby={`customiser-checks-${mode}`}>
            <h3
              id={`customiser-checks-${mode}`}
              className="mb-2 text-sm font-medium capitalize"
            >
              {mode}
            </h3>
            <ContrastTable palette={theme[mode]} mode={mode} />
          </section>
        ))}
      </section>

      <section aria-labelledby="customiser-export" className="flex flex-col gap-3">
        <h2 id="customiser-export" className="text-lg font-semibold">
          Export
        </h2>
        <p className="text-muted-foreground text-pretty text-sm">
          Paste this into your stylesheet after the Facade tokens, then set{" "}
          <code>data-facade-theme=&quot;custom&quot;</code> on <code>&lt;html&gt;</code>.
        </p>
        <figure className="bg-card overflow-hidden rounded-lg border">
          <figcaption className="border-border bg-muted/40 flex items-center justify-between gap-3 border-b px-4 py-2">
            <span className="text-muted-foreground font-mono text-xs">
              app/globals.css
            </span>
            <CopyButton value={css} label="Copy CSS" />
          </figcaption>
          <div
            tabIndex={0}
            role="region"
            aria-label="Exported CSS"
            className="focus-visible:ring-ring max-h-80 overflow-auto focus-visible:outline-none focus-visible:ring-2"
          >
            <pre className="p-4 font-mono text-xs">
              <code>{css}</code>
            </pre>
          </div>
        </figure>
      </section>
    </div>
  )
}
