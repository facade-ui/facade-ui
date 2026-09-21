import type { Metadata } from "next"

import { CodeBlock } from "@/components/code-block"
import { Prose } from "@/components/prose"

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "The WCAG 2.2 AA bar Facade UI holds itself to, and how each part of it is enforced.",
}

export default function AccessibilityPage() {
  return (
    <Prose>
      <h1 className="text-display-sm font-semibold">Accessibility</h1>
      <p>
        The target is WCAG 2.2 AA. What follows is the part that matters: how each claim
        is actually checked, because an accessibility statement nobody verifies is just a
        wish.
      </p>

      <h2>Contrast</h2>
      <p>
        <code>scripts/check-contrast.ts</code> parses the real token values out of{" "}
        <code>globals.css</code> and <code>themes.css</code>, resolves all six theme
        scopes, and checks every pair a section can put on screen. Text pairs must clear
        4.5:1 and the focus ring 3:1. It runs in CI and fails the build.
      </p>
      <p>
        Hairline borders are reported but not enforced. A divider is decorative; a control
        whose only boundary is a border is not, and those carry their own stronger colour.
      </p>

      <h2>Keyboard and focus</h2>
      <ul>
        <li>Every interactive element is reachable and operable by keyboard.</li>
        <li>
          Focus is always visible: <code>:focus-visible</code> gets a 2px ring with a 2px
          offset, defined once in the base layer.
        </li>
        <li>
          Every button size is at least 44&times;44 CSS px, which clears WCAG 2.5.5 rather
          than the 24px AA floor.
        </li>
        <li>
          Scrollable code blocks are focusable, so keyboard users can scroll them at all.
        </li>
      </ul>

      <h2>Structure</h2>
      <p>
        Sections never hard-code a heading level. Each takes <code>headingLevel</code>,
        and visual size is a separate prop — the same hero is an <code>h1</code> on a
        landing page and an <code>h2</code> inside a longer one, with no change in
        appearance.
      </p>
      <CodeBlock
        filename="Outline level is explicit"
        code={`<HeroSplit headingLevel={1} ... />   {/* landing page */}
<HeroSplit headingLevel={2} ... />   {/* inside an existing page */}`}
      />
      <p>
        A <code>&lt;section&gt;</code> is only a landmark once it has an accessible name,
        so <code>Section</code> pairs <code>aria-labelledby</code> with the id{" "}
        <code>SectionHeader</code> puts on the heading. An unnamed band renders as a{" "}
        <code>div</code> instead of adding a nameless region to the landmark list.
      </p>

      <h2>Motion</h2>
      <p>
        <code>FacadeMotionProvider</code> sets <code>reducedMotion=&quot;user&quot;</code>
        , and the base layer disables CSS transitions under{" "}
        <code>prefers-reduced-motion</code>. Animations only ever touch{" "}
        <code>opacity</code> and <code>transform</code>, so they cannot shift layout or
        contribute to CLS. The one exception is <code>Collapse</code>, where the height
        change is the interaction itself and is always user-initiated.
      </p>
      <p>
        Every section ships a static variant and a <code>-motion</code> variant. The
        static one is the default, and it renders identically with JavaScript disabled.
      </p>

      <h2>Images and icons</h2>
      <ul>
        <li>
          Data-driven images take a required <code>alt</code>. Logos and avatars use{" "}
          <code>alt=&quot;&quot;</code> deliberately, because the company or person&apos;s
          name is already text beside them — announcing both is noise, not information.
        </li>
        <li>
          Icons are <code>aria-hidden</code> unless they carry meaning on their own.{" "}
          <code>FeatureIcon</code> applies that for you rather than trusting each caller.
        </li>
      </ul>

      <h2>Things that read differently than they look</h2>
      <p>A few places deliberately separate the visual form from the spoken one:</p>
      <ul>
        <li>
          <code>Stat</code> puts the label before the value in the DOM — a definition list
          requires it, and a figure without its label is meaningless read aloud.
        </li>
        <li>
          <code>PricingTier</code> renders &quot;$29&quot; visually and &quot;29 dollars
          per month&quot; to screen readers, and a not-included feature says so in words
          rather than relying on a grey cross.
        </li>
        <li>
          <code>Testimonial</code> renders a rating as &quot;Rated 5 out of 5&quot;, not
          as five separately announced star icons.
        </li>
      </ul>

      <h2>What is checked automatically</h2>
      <ul>
        <li>Token contrast, across all six theme scopes.</li>
        <li>
          <code>eslint-plugin-jsx-a11y</code> in strict mode across the whole registry.
        </li>
        <li>
          Unit tests for the behaviours above, including reading order and accessible
          names.
        </li>
        <li>An axe-core scan of every section in light and dark, in Playwright.</li>
      </ul>
      <p>
        Automated checks catch perhaps a third of real accessibility problems. The
        keyboard walkthrough on each section&apos;s page is the other part, and it is
        written by hand.
      </p>
    </Prose>
  )
}
