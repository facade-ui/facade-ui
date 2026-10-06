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

- Templates: `saas-landing`, `agency`, `product-launch` (and, in Phase 5,
  `changelog` and `docs-site`). Each is composition
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

- **Default theme.** Tailwind's orange on stone; the monochrome palette is now
  the `neutral` preset. Primary buttons carry an ink label, because white on
  orange 600 is 3.6:1, and `--primary` is never used for text.
- **Contrast checker fix.** Both implementations decoded sRGB twice, so
  dark-on-light pairs scored better than they are. The light `--input` borders
  were really 2:1 and are now 3:1. The maths is tested against published WCAG
  ratios.
- **Customiser basic mode.** Brand colour, neutral and corners generate every
  token for both modes, always passing contrast. Every token is still editable
  under Advanced, and the panel floats instead of pushing the page aside.

### Phase 5 — Forms and more templates

- `select`: a drop-down on Base UI's Select, wired through Field the same way
  `input` is, so label, help text and an external error reach the trigger.
- `textarea`: the same wiring, with `Field.Control` rendering a `<textarea>`.
  With `input` and `select` that covers the fields a contact form needs. `input`
  also got the demo it never had, so it is now scanned and snapshotted too, and
  that demo showed its border stayed grey on an external error. All three
  fields now set `Field.Root invalid`, which marks the control and colours it.
- `changelog`: a template for release history, with a new `changelog-list`
  section doing the work. Each release is an article with its own heading,
  anchor and `<time>`, and each change carries its kind as a word.
- `docs-site`: a documentation page from `nav-top`, `nav-side` and `footer`,
  with an "On this page" list and previous and next links. The article body is
  a slot styled by a new `prose` atom, the registry's version of the docs
  site's own typography.
- `contact-form`: the section the field atoms were for. Fields come in as
  typed data and render as `input`, `select` or `textarea`. Base UI's `Form`
  runs the browser's checks and maps server errors to their fields; editing a
  field clears its error. Building it showed two gaps in the atoms: they hid
  the browser's own validation message, and they did not put their `name` on
  `Field.Root`, which `Form` needs to route errors. Both are fixed.

## Not started

Nothing from the original brief. What follows is what a second pass would
sensibly cover.

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
- **Base UI is at `1.0.0-rc.0`.** Two workarounds are in the tree and both are
  commented with what to revisit: the invalid `aria-orientation` on
  `NavigationMenu.List`, and the fact that `Dialog.Trigger` cannot see through a
  wrapper component when checking for a native button. One finding has no
  workaround: an open `Select` renders focus-guard spans that axe reports as
  `aria-hidden-focus`. They hand focus straight back to the list, so nothing can
  rest on them, and the axe gate scans previews closed.
