import type { Metadata } from "next"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { Prose } from "@/components/prose"

export const metadata: Metadata = {
  title: "Theming",
  description:
    "How Facade UI's colours and other design tokens are organised, and how to change the theme in one place.",
}

const TOKENS: [string, string, string][] = [
  [
    "--facade-text-display-sm/md/lg/xl",
    "Heading sizes",
    "They scale with the screen width, so headings need no breakpoints",
  ],
  [
    "--facade-section-y-sm/–/lg",
    "Space above and below a section",
    "Set with the spacing prop on Section",
  ],
  [
    "--facade-container-max",
    "Maximum content width",
    'Used by Container size="lg" and the max-w-facade class',
  ],
  ["--facade-container-gutter", "Side padding", "Applied by Container on small screens"],
  [
    "--facade-duration-fast/base/slow",
    "Animation durations",
    "Also defined in lib/motion.ts; a test keeps the two equal",
  ],
  [
    "--facade-ease-out/in-out/spring",
    "Animation easing curves",
    "Available as ease-facade-* classes",
  ],
  [
    "--facade-motion-distance",
    "Animation distance",
    "How far FadeIn and Reveal move an element",
  ],
]

export default function ThemingPage() {
  return (
    <Prose>
      <h1 className="text-display-sm font-semibold">Theming</h1>
      <p>
        Facade UI is styled with design tokens, which are CSS variables. There are two
        groups of tokens. This page explains each group and how to change them.
      </p>

      <h2>Colour and radius: shadcn names</h2>
      <p>
        Colours and corner radius use the same variable names as shadcn/ui:{" "}
        <code>--background</code>, <code>--primary</code>, <code>--muted</code>,{" "}
        <code>--border</code>, <code>--ring</code> and <code>--radius</code>. Sections use
        only these names for colour. If you add a section to a project that already has a
        shadcn theme, the section uses that theme without any changes.
      </p>
      <p>Two values differ from shadcn&apos;s defaults, both to meet contrast rules:</p>
      <ul>
        <li>
          <code>--ring</code> is the primary colour, not a pale grey. The default shadcn
          ring has a contrast of about 2.2:1 on white. WCAG 2.2 requires 3:1 for a focus
          indicator.
        </li>
        <li>
          <code>--input</code> is much darker than <code>--border</code>, also to reach
          3:1. The border of a text field is the only thing that shows where the field is.
        </li>
      </ul>
      <p>If you use your own values for these two tokens, check their contrast.</p>

      <h2>The default colours</h2>
      <p>
        By default, Facade UI uses Tailwind&apos;s <strong>orange</strong> with its{" "}
        <strong>stone</strong> greys:
      </p>
      <ul>
        <li>Primary: orange 600 in light mode, orange 500 in dark mode.</li>
        <li>Accent: orange 100 and orange 800.</li>
        <li>Backgrounds, borders and text: stone.</li>
      </ul>
      <p>
        The label on a primary button is near-black, not white, because white on orange
        600 has a contrast of only 3.6:1. For the same reason, no component uses{" "}
        <code>--primary</code> as a text colour. Use it for fills, icons and focus rings.
      </p>

      <h2>Type, spacing and animation: Facade names</h2>
      <p>
        Tokens for heading sizes, spacing and animation start with <code>--facade-</code>.
        The prefix stops them from clashing with any name shadcn adds later.
      </p>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">Design tokens that start with --facade-</caption>
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
        The registry includes three more colour themes, in <code>themes.css</code>:
      </p>
      <ul>
        <li>
          <em>Neutral</em>: black, white and grey, the same as shadcn&apos;s default.
        </li>
        <li>
          <em>Warm</em>: brown on cream.
        </li>
        <li>
          <em>Vivid</em>: indigo.
        </li>
      </ul>
      <p>
        To use one, set <code>data-facade-theme</code> on <code>&lt;html&gt;</code> or on
        any element in the page. The orange default needs no attribute. Light and dark
        mode are set separately, with the <code>dark</code> class. You can try both with
        the switches in the header.
      </p>
      <CodeBlock
        lang="html"
        filename="Using a preset"
        code={`<html data-facade-theme="warm">        <!-- warm, light -->
<html class="dark" data-facade-theme="warm">  <!-- warm, dark -->`}
      />

      <h2>Create your own theme</h2>
      <p>
        To create a theme, set the shadcn-named tokens in one CSS block. Every section
        then uses your colours. You do not need to change anything else.
      </p>
      <p>
        The fastest way is the theme customiser. Open it with the palette button in the
        header, then choose a brand colour and a neutral. It generates all the tokens
        shown below, for light and dark mode, and they already pass the contrast checks.
        The whole site changes as you choose, so you see the result on real pages. The{" "}
        <Link href="/docs/customise">theme customiser</Link> page shows the contrast
        results and the CSS to copy.
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
        Check the contrast of your theme before you use it. Every preset in this
        repository is tested by <code>scripts/check-contrast.ts</code>. It reads the
        colours from the CSS and fails the build if text contrast is below 4.5:1 or focus
        ring contrast is below 3:1. Run it on your own preset too.
      </p>
    </Prose>
  )
}
