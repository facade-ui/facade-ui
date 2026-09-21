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

## Not started

### Phase 3 — Templates and theming

- Templates: `saas-landing`, `agency`, `product-launch`.
- Theme customiser on facadeui.dev that exports CSS variables.
- Registry install for whole templates.

## Known gaps

- **Visual baselines exist for macOS only.** Snapshots are namespaced by
  platform because macOS and the Linux CI container rasterise text differently.
  The first CI run of the `visual` job will fail with no Linux baseline;
  download the artifact and commit the PNGs under
  `e2e/__screenshots__/linux/` to bootstrap it.
- **No GitHub remote yet.** The plan calls for a PR per registry item; the work
  so far is committed to `main` in a local repository. Point it at
  `facade-ui/facade-ui` and the CI workflow is ready to run as-is.
- **`facadeui.dev` is not live.** Registry dependency URLs already point at it,
  which is correct for what ships; the smoke test rewrites them to a local
  server so it can run offline.
- **Base UI is at `1.0.0-rc.0`.** Two workarounds are in the tree and both are
  commented with what to revisit: the invalid `aria-orientation` on
  `NavigationMenu.List`, and the fact that `Dialog.Trigger` cannot see through a
  wrapper component when checking for a native button.
