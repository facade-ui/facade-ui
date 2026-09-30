# Accessibility

Facade UI aims to meet WCAG 2.2 AA. This page explains how each requirement is tested.

## Contrast

A script, `scripts/check-contrast.ts`, reads the colour values from `globals.css` and `themes.css`. It checks every text and background pair a section can show, in all eight combinations of theme and mode. Text needs a contrast ratio of at least 4.5:1. Focus rings and form field borders need at least 3:1. The script runs on every change, and a failure stops the build.

The default theme is an example. White text on its orange primary colour has a ratio of 3.6:1, which is too low, so button labels are near-black at 5.5:1. The orange itself reaches only 3:1 against the page background. That is enough for fills, icons and focus rings, but not for text, so no component uses it as a text colour.

Thin divider lines are reported but do not have to pass, because a divider is decoration. The border of a form field is different: it is the only thing that shows where the field is. Form fields therefore use a separate, darker border colour.

## Keyboard and focus

- You can reach and use every interactive element with the keyboard.
- Focus is always visible. A focused element gets a 2px ring with a 2px offset, through `:focus-visible`. This is defined once, in the base styles.
- Every button is at least 44×44 CSS pixels. This meets the stricter WCAG 2.5.5 target size, not only the 24-pixel minimum of level AA.
- Code blocks that scroll can take focus, so keyboard users can scroll them.

## Headings and landmarks

Sections do not set a fixed heading level. Each one has a `headingLevel` prop, and a separate prop for visual size. The same hero can be an `h1` on a landing page and an `h2` inside a longer page, and look the same in both.

```tsx
<HeroSplit headingLevel={1} ... />   {/* landing page */}
<HeroSplit headingLevel={2} ... />   {/* inside an existing page */}
```

A `<section>` element only counts as a landmark when it has an accessible name. The `Section` component therefore points `aria-labelledby` at the id that `SectionHeader` puts on the heading. A section without a heading is rendered as a `div`, so it does not add an unnamed region to the list of landmarks.

## Animation

`FacadeMotionProvider` follows the reduced-motion setting on the reader's device, and the base styles turn off CSS transitions when that setting is on. Animations change only `opacity` and `transform`, so they cannot move the layout. The one exception is `Collapse`. It animates height, because opening and closing a panel is the interaction itself, and it only happens when the reader asks for it.

Every section has a static version and a `-motion` version. The static version is the default, and it looks the same with JavaScript turned off.

## Images and icons

- Images that come from your data must have `alt` text. Logos and avatars use `alt=""` on purpose. The company or person's name is already shown as text next to the image, so a screen reader would otherwise read it twice.
- Icons are hidden from screen readers with `aria-hidden`, unless the icon alone carries the meaning. `FeatureIcon` does this for you.

## Where the spoken text differs from what you see

In a few places, screen readers get different text or a different order:

- `Stat` puts the label before the value in the HTML, because a description list requires that order. A number read aloud without its label means nothing.
- `PricingTier` shows "$29" on screen and gives "29 dollars per month" to screen readers. A feature that is not included says so in words, not only with a grey cross.
- `Testimonial` gives a rating as "Rated 5 out of 5", not as five separate star icons.

## What is checked automatically

- Colour contrast, in all eight combinations of theme and mode.
- `eslint-plugin-jsx-a11y` in strict mode, on every component.
- Unit tests for the behaviour described on this page, including reading order and accessible names.
- An axe-core scan of every section in light and dark mode, run with Playwright.

Automated checks find only some accessibility problems, perhaps a third. Test your finished page with a keyboard and a screen reader as well.
