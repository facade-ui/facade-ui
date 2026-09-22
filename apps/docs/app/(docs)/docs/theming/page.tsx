import type { Metadata } from "next"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { Prose } from "@/components/prose"

export const metadata: Metadata = {
  title: "Theming",
  description:
    "How Facade UI's tokens are organised, and how to retheme everything from one file.",
}

const TOKENS: [string, string, string][] = [
  [
    "--facade-text-display-sm/md/lg/xl",
    "Fluid display scale",
    "clamp() based, so headlines need no breakpoint juggling",
  ],
  ["--facade-section-y-sm/–/lg", "Vertical rhythm", "Consumed by Section's spacing prop"],
  ["--facade-container-max", "Measure", 'Drives Container size="lg" and max-w-facade'],
  [
    "--facade-container-gutter",
    "Horizontal padding",
    "The gutter Container applies below sm",
  ],
  [
    "--facade-duration-fast/base/slow",
    "Motion durations",
    "Mirrored in lib/motion.ts and checked by a test",
  ],
  [
    "--facade-ease-out/in-out/spring",
    "Motion easings",
    "Exposed as ease-facade-* utilities",
  ],
  ["--facade-motion-distance", "Travel distance", "How far FadeIn and Reveal translate"],
]

export default function ThemingPage() {
  return (
    <Prose>
      <h1 className="text-display-sm font-semibold">Theming</h1>
      <p>
        Facade UI has two token families, and knowing which one you are touching is most
        of the story.
      </p>

      <h2>shadcn names</h2>
      <p>
        Colour and radius use shadcn&apos;s own names — <code>--background</code>,{" "}
        <code>--primary</code>, <code>--muted</code>, <code>--border</code>,{" "}
        <code>--ring</code>, <code>--radius</code>. Sections reference nothing else, which
        is why a section dropped into an existing shadcn project inherits that
        project&apos;s theme with no edits at all.
      </p>
      <p>
        One deliberate difference: Facade&apos;s default <code>--ring</code> is darker
        than shadcn&apos;s. The stock value sits at roughly 2.2:1 against a white
        background, below the 3:1 that WCAG 2.2 requires for a non-text indicator. If you
        keep your own ring colour, check it.
      </p>

      <h2>Facade names</h2>
      <p>
        Everything marketing-specific is prefixed <code>--facade-</code> so it can never
        collide with a token shadcn might add later.
      </p>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">Facade-prefixed design tokens</caption>
          <thead className="bg-muted/40">
            <tr>
              <th scope="col" className="px-4 py-2 font-medium">
                Token
              </th>
              <th scope="col" className="px-4 py-2 font-medium">
                Purpose
              </th>
              <th scope="col" className="px-4 py-2 font-medium">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {TOKENS.map(([token, purpose, note]) => (
              <tr key={token} className="border-t align-top">
                <th scope="row" className="px-4 py-3 text-left font-normal">
                  <code className="font-mono text-xs">{token}</code>
                </th>
                <td className="text-muted-foreground px-4 py-3">{purpose}</td>
                <td className="text-muted-foreground px-4 py-3 text-xs">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Presets</h2>
      <p>
        Three presets ship with the registry. <em>Neutral</em> is the default and needs no
        attribute; <em>warm</em> and <em>vivid</em> are applied with{" "}
        <code>data-facade-theme</code> on <code>&lt;html&gt;</code> or on any subtree.
        Light and dark are an independent axis, set by the <code>dark</code> class — try
        both switches in the header.
      </p>
      <CodeBlock
        lang="html"
        filename="Applying a preset"
        code={`<html data-facade-theme="warm">        <!-- warm, light -->
<html class="dark" data-facade-theme="warm">  <!-- warm, dark -->`}
      />

      <h2>Making your own</h2>
      <p>
        Override the shadcn-named tokens in one block and every section re-themes. Nothing
        else needs to change.
      </p>
      <p>
        To find the numbers, open the customiser with the palette button in the header and
        drag: it edits the tokens below in OKLCH and applies them to this whole site as
        you go, so you are judging a real page rather than a swatch. The{" "}
        <Link href="/docs/customise">theme customiser</Link> page has the contrast table
        and the CSS to paste back here.
      </p>
      <CodeBlock
        lang="css"
        filename="app/globals.css"
        code={`[data-facade-theme="brand"] {
  --background: oklch(1 0 0);
  --foreground: oklch(0.17 0.02 264);
  --primary: oklch(0.48 0.18 264);
  --primary-foreground: oklch(0.99 0 0);
  --muted: oklch(0.96 0.01 264);
  --muted-foreground: oklch(0.47 0.03 264);
  --border: oklch(0.91 0.01 264);
  --ring: oklch(0.48 0.18 264);
}`}
      />
      <p>
        Check the result rather than trusting it. Every preset in this repo is verified by{" "}
        <code>scripts/check-contrast.ts</code>, which resolves each theme scope from the
        real CSS and fails the build if a text pair drops below 4.5:1 or the focus ring
        below 3:1. Point it at your own preset before you ship it.
      </p>
    </Prose>
  )
}
