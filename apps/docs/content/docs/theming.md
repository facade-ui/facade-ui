# Theming

Facade UI is styled with design tokens, which are CSS variables. There are two groups of tokens. This page explains each group and how to change them.

## Colour and radius: shadcn names

Colours and corner radius use the same variable names as shadcn/ui: `--background`, `--primary`, `--muted`, `--border`, `--ring` and `--radius`. Sections use only these names for colour. If you add a section to a project that already has a shadcn theme, the section uses that theme without any changes.

Two values differ from shadcn's defaults, both to meet contrast rules:

- `--ring` is the primary colour, not a pale grey. The default shadcn ring has a contrast of about 2.2:1 on white. WCAG 2.2 requires 3:1 for a focus indicator.
- `--input` is much darker than `--border`, also to reach 3:1. The border of a text field is the only thing that shows where the field is.

If you use your own values for these two tokens, check their contrast.

## The default colours

By default, Facade UI uses Tailwind's orange with its stone greys:

- Primary: orange 600 in light mode, orange 500 in dark mode.
- Accent: orange 100 and orange 800.
- Backgrounds, borders and text: stone.

The label on a primary button is near-black, not white, because white on orange 600 has a contrast of only 3.6:1. For the same reason, no component uses `--primary` as a text colour. Use it for fills, icons and focus rings.

## Type, spacing and animation: Facade names

Tokens for heading sizes, spacing and animation start with `--facade-`. The prefix stops them from clashing with any name shadcn adds later.

| Token                               | Purpose                         | Notes                                                             |
| ----------------------------------- | ------------------------------- | ----------------------------------------------------------------- |
| `--facade-text-display-sm/md/lg/xl` | Heading sizes                   | They scale with the screen width, so headings need no breakpoints |
| `--facade-section-y-sm/–/lg`        | Space above and below a section | Set with the `spacing` prop on `Section`                          |
| `--facade-container-max`            | Maximum content width           | Used by `Container size="lg"` and the `max-w-facade` class        |
| `--facade-container-gutter`         | Side padding                    | Applied by `Container` on small screens                           |
| `--facade-duration-fast/base/slow`  | Animation durations             | Also defined in `lib/motion.ts`; a test keeps the two equal       |
| `--facade-ease-out/in-out/spring`   | Animation easing curves         | Available as `ease-facade-*` classes                              |
| `--facade-motion-distance`          | Animation distance              | How far `FadeIn` and `Reveal` move an element                     |

## Presets

The registry includes three more colour themes, in `themes.css`:

- Neutral: black, white and grey, the same as shadcn's default.
- Warm: brown on cream.
- Vivid: indigo.

To use one, set `data-facade-theme` on `<html>` or on any element in the page. The orange default needs no attribute. Light and dark mode are set separately, with the `dark` class.

```html
<html data-facade-theme="warm">
  <!-- warm, light -->
  <html class="dark" data-facade-theme="warm">
    <!-- warm, dark -->
  </html>
</html>
```

## Create your own theme

To create a theme, set the shadcn-named tokens in one CSS block. Every section then uses your colours. You do not need to change anything else.

The fastest way is the theme customiser on facadeui.dev. Open it with the palette button in the header, then choose a brand colour and a neutral. It generates all the tokens for light and dark mode, and they already pass the contrast checks. The [theme customiser](https://facadeui.dev/docs/customise) page shows the contrast results and the CSS to copy.

```css
[data-facade-theme="brand"] {
  --background: oklch(1 0 0);
  --foreground: oklch(0.17 0.02 264);
  --primary: oklch(0.48 0.18 264);
  --primary-foreground: oklch(0.99 0 0);
  --muted: oklch(0.96 0.01 264);
  --muted-foreground: oklch(0.47 0.03 264);
  --border: oklch(0.91 0.01 264);
  --ring: oklch(0.48 0.18 264);
}
```

Check the contrast of your theme before you use it. Every preset in the Facade UI repository is tested by `scripts/check-contrast.ts`. It reads the colours from the CSS and fails the build if text contrast is below 4.5:1 or focus ring contrast is below 3:1.
