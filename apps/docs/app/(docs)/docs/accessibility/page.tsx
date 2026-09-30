import type { Metadata } from "next"

import { CodeBlock } from "@/components/code-block"
import { Prose } from "@/components/prose"

export const metadata: Metadata = {
  title: "Accessibility",
  description: "How Facade UI meets WCAG 2.2 AA, and how each requirement is tested.",
  alternates: {
    canonical: "/docs/accessibility",
    types: { "text/markdown": "/docs/accessibility.md" },
  },
}

export default function AccessibilityPage() {
  return (
    <Prose>
      <h1 className="text-display-sm font-semibold">Accessibility</h1>
      <p>
        Facade UI aims to meet WCAG 2.2 AA. This page explains how each requirement is
        tested.
      </p>

      <h2>Contrast</h2>
      <p>
        A script, <code>scripts/check-contrast.ts</code>, reads the colour values from{" "}
        <code>globals.css</code> and <code>themes.css</code>. It checks every text and
        background pair a section can show, in all eight combinations of theme and mode.
        Text needs a contrast ratio of at least 4.5:1. Focus rings and form field borders
        need at least 3:1. The script runs on every change, and a failure stops the build.
      </p>
      <p>
        The default theme is an example. White text on its orange primary colour has a
        ratio of 3.6:1, which is too low, so button labels are near-black at 5.5:1. The
        orange itself reaches only 3:1 against the page background. That is enough for
        fills, icons and focus rings, but not for text, so no component uses it as a text
        colour.
      </p>
      <p>
        Thin divider lines are reported but do not have to pass, because a divider is
        decoration. The border of a form field is different: it is the only thing that
        shows where the field is. Form fields therefore use a separate, darker border
        colour.
      </p>

      <h2>Keyboard and focus</h2>
      <ul>
        <li>You can reach and use every interactive element with the keyboard.</li>
        <li>
          Focus is always visible. A focused element gets a 2px ring with a 2px offset,
          through <code>:focus-visible</code>. This is defined once, in the base styles.
        </li>
        <li>
          Every button is at least 44&times;44 CSS pixels. This meets the stricter WCAG
          2.5.5 target size, not only the 24-pixel minimum of level AA.
        </li>
        <li>
          Code blocks that scroll can take focus, so keyboard users can scroll them.
        </li>
      </ul>

      <h2>Headings and landmarks</h2>
      <p>
        Sections do not set a fixed heading level. Each one has a{" "}
        <code>headingLevel</code> prop, and a separate prop for visual size. The same hero
        can be an <code>h1</code> on a landing page and an <code>h2</code> inside a longer
        page, and look the same in both.
      </p>
      <CodeBlock
        filename="Setting the heading level"
        code={`<HeroSplit headingLevel={1} ... />   {/* landing page */}
<HeroSplit headingLevel={2} ... />   {/* inside an existing page */}`}
      />
      <p>
        A <code>&lt;section&gt;</code> element only counts as a landmark when it has an
        accessible name. The <code>Section</code> component therefore points{" "}
        <code>aria-labelledby</code> at the id that <code>SectionHeader</code> puts on the
        heading. A section without a heading is rendered as a <code>div</code>, so it does
        not add an unnamed region to the list of landmarks.
      </p>

      <h2>Animation</h2>
      <p>
        <code>FacadeMotionProvider</code> follows the reduced-motion setting on the
        reader&apos;s device, and the base styles turn off CSS transitions when that
        setting is on. Animations change only <code>opacity</code> and{" "}
        <code>transform</code>, so they cannot move the layout. The one exception is{" "}
        <code>Collapse</code>. It animates height, because opening and closing a panel is
        the interaction itself, and it only happens when the reader asks for it.
      </p>
      <p>
        Every section has a static version and a <code>-motion</code> version. The static
        version is the default, and it looks the same with JavaScript turned off.
      </p>

      <h2>Images and icons</h2>
      <ul>
        <li>
          Images that come from your data must have <code>alt</code> text. Logos and
          avatars use <code>alt=&quot;&quot;</code> on purpose. The company or
          person&apos;s name is already shown as text next to the image, so a screen
          reader would otherwise read it twice.
        </li>
        <li>
          Icons are hidden from screen readers with <code>aria-hidden</code>, unless the
          icon alone carries the meaning. <code>FeatureIcon</code> does this for you.
        </li>
      </ul>

      <h2>Where the spoken text differs from what you see</h2>
      <p>In a few places, screen readers get different text or a different order:</p>
      <ul>
        <li>
          <code>Stat</code> puts the label before the value in the HTML, because a
          description list requires that order. A number read aloud without its label
          means nothing.
        </li>
        <li>
          <code>PricingTier</code> shows &quot;$29&quot; on screen and gives &quot;29
          dollars per month&quot; to screen readers. A feature that is not included says
          so in words, not only with a grey cross.
        </li>
        <li>
          <code>Testimonial</code> gives a rating as &quot;Rated 5 out of 5&quot;, not as
          five separate star icons.
        </li>
      </ul>

      <h2>What is checked automatically</h2>
      <ul>
        <li>Colour contrast, in all eight combinations of theme and mode.</li>
        <li>
          <code>eslint-plugin-jsx-a11y</code> in strict mode, on every component.
        </li>
        <li>
          Unit tests for the behaviour described on this page, including reading order and
          accessible names.
        </li>
        <li>
          An axe-core scan of every section in light and dark mode, run with Playwright.
        </li>
      </ul>
      <p>
        Automated checks find only some accessibility problems, perhaps a third. Test your
        finished page with a keyboard and a screen reader as well.
      </p>
    </Prose>
  )
}
