# Roadmap

## Done

### Phase 0 — Foundations

- pnpm + Turborepo workspace, shared `tsconfig` and flat ESLint configs.
- Token layer with three verified theme presets.
- `lib/utils`, `lib/types`, `lib/motion`; `FacadeMotionProvider`, `FadeIn`,
  `Reveal`, `Stagger`, `Collapse`, and the slot adapters.
- Registry build producing valid shadcn registry items, validated against
  shadcn's own JSON Schema plus project conventions.
- Docs site: branding, sidebar, iframe previews with theme and breakpoint
  toggles, code tabs, copy buttons, install commands, generated props tables.
- Atoms: Button, Badge, Heading, Eyebrow, Container, Section, SectionHeader,
  CtaGroup, Stat, LogoMark, FeatureIcon, Testimonial, PricingTier.
- CI: lint, typecheck, unit tests, contrast, registry validation, axe across
  every theme scope, visual regression, and a fresh-install smoke test.

### Phase 1 — Core sections

`nav-top`, `hero-centered`, `hero-split`, `hero-with-media`, `logo-cloud`,
`usp-list`, `feature-grid`, `feature-rows`, `bento-grid`, `faq-accordion`,
`cta-band`, `footer` — each with a `-motion` variant where motion adds
something the static version cannot do.

### Phase 2 — Breadth

`stats`, `testimonials-grid`, `testimonial-single`, `pricing-tiers`,
`pricing-comparison`, `card-list`, `feature-tabs`, `steps`, `team`,
`newsletter`, `banner`, `nav-side`, plus the `input` atom they needed.

The form-field contrast gap flagged here earlier is closed. shadcn already
separates `--border` (dividers) from `--input` (control boundaries), so
`--input` was darkened until it clears 3:1 against the background in every
theme scope, and `scripts/check-contrast.ts` now **enforces** it rather than
reporting it. `--border` stays informational, because a hairline divider is
decoration.

### Phase 3 — Templates and theming

- Templates: `saas-landing`, `agency`, `product-launch`. Each is composition
  over the existing sections with one content object, and each sets the heading
  outline explicitly rather than leaning on section defaults — so the page has
  exactly one `h1` and no skipped levels.
- Registry install for whole templates works through the derived dependency
  graph: `shadcn add saas-landing` pulls in sixteen other items without any of
  them being listed by hand.
- Theme customiser, in a panel that opens from the header on any page. It edits
  in OKLCH, because lightness is the axis contrast depends on, and it scores the
  palette against the _same_ pairs and thresholds `scripts/check-contrast.ts`
  enforces in CI — so a palette that shows all-green is one the build would
  accept. Presets are read out of the shipped CSS at build time rather than
  re-declared. The palette applies to the whole docs site as one more theme
  preset, previews included, so there is no preview pane to disagree with the
  real thing; `/docs/customise` keeps the contrast table and the CSS export.

### Phase 4 — An identity of its own

- **The default is no longer monochrome.** It is Tailwind's orange on stone,
  step for step, and the old black-and-white palette is a preset (`neutral`)
  alongside `warm` and `vivid`. The label on a primary button is ink rather than
  white, because white on orange 600 is 3.6:1; and nothing sets text in
  `--primary` any more — an eyebrow carries the brand in a tick beside the
  label, which only has to clear 3:1.
- **The contrast checker was wrong, and is fixed.** Both implementations ran
  linear-light values through the sRGB decode a second time, so every colour
  scored darker than it is: dark-on-light pairs looked safer than they were,
  light-on-dark ones worse. Text pairs had enough headroom that nothing visible
  changed. The light `--input` borders did not — they sat at 2:1 while reporting
  4.3:1 — and have been darkened to a real 3:1. The arithmetic is now tested
  against the ratios every WCAG reference quotes, not just against itself.
- **The customiser has a basic mode.** Brand colour, neutral, corners; the
  nineteen tokens are generated, for both modes, by the same recipe that
  produces the default theme, and a test holds that no choice the swatches
  offer — nor any of a sweep of arbitrary hex colours — produces a pair CI would
  reject. Every token is still there, under Advanced. The panel floats over the
  page instead of reserving a gutter, so opening it no longer reflows what it
  is there to restyle.

## Not started

Nothing from the original brief. What follows is what a second pass would
sensibly cover.

- **More templates.** `docs-site` and `changelog` are the obvious gaps, and
  `nav-side` and `card-list` already exist for them.
- **A `Select` and `Textarea`** to go with `Input`, for contact-form sections.
- **Dark-mode logo swapping** in `LogoMark`. Most brand marks need a different
  file per theme, and right now that is the caller's problem.

## Known gaps

- **Visual baselines weigh about 16 MB per platform.** Snapshots are namespaced
  by platform, because macOS and the Linux CI container rasterise text
  differently, and both sets are committed — roughly 32 MB, growing with every
  intentional visual change. Templates are captured at viewport height rather
  than full-page, which took the three of them from 6.0 MB to 1.9 MB per
  platform: a template is composition over sections that are each already
  snapshotted individually, so a 6,500 px capture was mostly re-photographing
  covered ground. The gap that leaves is a regression that appears only in a
  template and only below the fold.
- **No PR per registry item.** The brief asks for one; the work landed as seven
  phase-scoped commits pushed straight to `main` on
  [facade-ui/facade-ui](https://github.com/facade-ui/facade-ui). Worth turning
  on branch protection before the next change.
- **`facadeui.dev` is not live.** Registry dependency URLs already point at it,
  which is correct for what ships; the smoke test rewrites them to a local
  server so it can run offline.
- **Base UI is at `1.0.0-rc.0`.** Two workarounds are in the tree and both are
  commented with what to revisit: the invalid `aria-orientation` on
  `NavigationMenu.List`, and the fact that `Dialog.Trigger` cannot see through a
  wrapper component when checking for a native button.
