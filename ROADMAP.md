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
- CI: lint, typecheck, unit tests, contrast, registry validation, axe across six
  theme scopes, visual regression, and a fresh-install smoke test.

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
`--input` was darkened until it clears 3:1 against the background in all six
theme scopes, and `scripts/check-contrast.ts` now **enforces** it rather than
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
- Theme customiser at `/docs/customise`. It edits in OKLCH, because lightness is
  the axis contrast depends on, and it scores the palette against the _same_
  pairs and thresholds `scripts/check-contrast.ts` enforces in CI — so a palette
  that shows all-green is one the build would accept. Presets are read out of
  the shipped CSS at build time rather than re-declared.

## Not started

Nothing from the original brief. What follows is what a second pass would
sensibly cover.

- **More templates.** `docs-site` and `changelog` are the obvious gaps, and
  `nav-side` and `card-list` already exist for them.
- **A `Select` and `Textarea`** to go with `Input`, for contact-form sections.
- **Dark-mode logo swapping** in `LogoMark`. Most brand marks need a different
  file per theme, and right now that is the caller's problem.

## Known gaps

- **Visual baselines weigh about 21 MB per platform.** Snapshots are namespaced
  by platform, because macOS and the Linux CI container rasterise text
  differently, and both sets are committed — roughly 42 MB, growing with every
  intentional visual change. Most of it is the full-page template snapshots,
  which are 4,000–6,500 px tall and largely redundant: a template is composition
  over sections that are already snapshotted individually. Capturing templates
  at viewport height instead would cut about a third of the weight and make the
  diffs readable, at the cost of not catching a template-only regression below
  the fold.
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
