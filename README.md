# Facade UI

[![CI](https://github.com/facade-ui/facade-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/facade-ui/facade-ui/actions/workflows/ci.yml)
[![Registry](https://img.shields.io/badge/shadcn_registry-%40facade-f54900)](https://facadeui.dev/r/registry.json)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG_2.2-AA_tested-0c0a09)](https://facadeui.dev/docs/accessibility)
[![MIT](https://img.shields.io/badge/licence-MIT-0c0a09)](./LICENSE)

**Sections and templates for marketing websites.**

Facade UI gives you the parts a marketing website needs: heroes, feature grids,
pricing tables, FAQs, footers and full page templates. It is free and open
source (MIT). You install each part with the shadcn CLI, and its **source code
is copied into your project**. There is no package to depend on.

```bash
npx shadcn@latest add @facade/saas-landing
```

That installs a complete landing page and the sixteen sections it is made of. Any single piece works the same way: `npx shadcn@latest add @facade/hero-split`. `@facade` is in the shadcn registry directory, so there is nothing to configure.

Starting from nothing? The [starter](https://github.com/facade-ui/starter) is a Next.js app with a complete landing page already in place:

```bash
npx create-next-app@latest my-site -e https://github.com/facade-ui/starter
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffacade-ui%2Fstarter&project-name=my-site&repository-name=my-site)

Building with an AI agent? Point it at [facadeui.dev/docs/agents](https://facadeui.dev/docs/agents) or [facadeui.dev/llms.txt](https://facadeui.dev/llms.txt). Using Claude? Add the [Facade UI plugin](https://claude.ai/customize/plugins/id/86e8de8c-f5a8-41b7-937e-a8990b365185%40anthropic-plugin-directory) from the Claude directory.

---

## What is in here

| Layer              | What it is                                                                                                                                                                                                                                                                                                                                                            |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens`, `themes` | Tailwind v4 token layer. shadcn-compatible colour names plus `--facade-*` display type, section rhythm and motion. Tailwind's orange on stone by default; three presets: neutral, warm, vivid.                                                                                                                                                                        |
| Atoms              | `button`, `badge`, `heading`, `eyebrow`, `container`, `section`, `section-header`, `cta-group`, `stat`, `logo-mark`, `feature-icon`, `testimonial`, `pricing-tier`, `input`, `select`, `textarea`                                                                                                                                                                     |
| Motion             | `motion-primitives`: `FacadeMotionProvider`, `FadeIn`, `Reveal`, `Stagger`, `Collapse`, and the slot adapters the `-motion` sections use                                                                                                                                                                                                                              |
| Sections           | `nav-top`, `nav-side`, three heroes, `logo-cloud`, `usp-list`, `feature-grid`, `feature-rows`, `feature-tabs`, `bento-grid`, `stats`, `steps`, `testimonials-grid`, `testimonial-single`, `team`, `pricing-tiers`, `pricing-comparison`, `card-list`, `changelog-list`, `faq-accordion`, `newsletter`, `banner`, `cta-band`, `footer` — most with a `-motion` variant |
| Templates          | `saas-landing`, `agency`, `product-launch`, `changelog`                                                                                                                                                                                                                                                                                                               |

## Decisions, and why

- **Base UI, never Radix.** One primitive library. Mixing two in a tree doubles
  the bundle and the bugs.
- **React 19, server components by default.** Only the motion wrappers and
  `nav-top` (which holds drawer state) are client components.
- **Nothing imports `next/*`.** Sections take _component types_ for images and
  links, so `next/image` and `next/link` are pluggable rather than assumed, and
  the reference survives a server-to-client boundary.
- **Static first.** Every section ships static and renders identically with
  JavaScript disabled. `-motion` variants wrap the static file and swap slot
  components; they duplicate no markup and no accessibility behaviour.
- **shadcn token names.** A section dropped into an existing shadcn project
  inherits that project's theme with no edits.

## Accessibility

The target is WCAG 2.2 AA, and the point is that it is _checked_:

- `pnpm contrast` resolves all eight theme scopes (light/dark x the default and
  three presets) from the real CSS and fails if a text pair drops below 4.5:1 or
  the focus ring or a form-field border below 3:1. It has already caught two
  real regressions.
- `pnpm e2e:a11y` runs axe-core over all 62 previews in all eight scopes, plus
  the docs site itself. It has already caught six real defects:
  `LogoMark`'s resting opacity dimming text below 4.5:1, an invalid
  `aria-orientation` Base UI puts on a `<ul>`, a `<dl>` with its `dt`/`dd` pairs
  nested two `div`s deep, a `<div>` where an `<li>` belongs inside an `<ol>`,
  syntax-highlighting themes whose comment colour failed AA, and a scrollable
  export block no keyboard user could reach.
- `eslint-plugin-jsx-a11y` runs in **strict** mode across the whole registry.
- Unit tests pin reading order, accessible names, heading levels, focus return
  and Escape handling.

Every button size is at least 44x44 CSS px. Read
[the accessibility guide](https://facadeui.dev/docs/accessibility) for the
reasoning behind the less obvious choices.

## Repository

```
apps/docs/            Next.js docs site (facadeui.dev), previews in real iframes
packages/registry/    @facade-ui/registry — source of truth for every item
packages/eslint-config, packages/tsconfig
scripts/              registry build, validator, props extractor, contrast, smoke
e2e/                  axe and visual regression
```

## Commands

```bash
pnpm install
pnpm dev                # docs site
pnpm lint               # eslint, strict + jsx-a11y strict
pnpm typecheck
pnpm test               # vitest
pnpm contrast           # WCAG check over every theme scope
pnpm registry:build     # emit apps/docs/public/r/*.json
pnpm registry:validate  # shadcn schema + Facade conventions
pnpm e2e:a11y           # axe, 6 theme scopes
pnpm e2e                # axe + visual regression
pnpm smoke              # install every item into a fresh Next.js project
```

`pnpm smoke` is the one worth knowing about: it scaffolds `create-next-app`,
runs `shadcn init`, serves the built registry over HTTP, installs every item
through the real shadcn CLI, and typechecks the result.

## Status

All four phases of the brief are built: foundations and tooling, the core
sections, the breadth sections, and the templates plus the theme customiser —
66 registry items in total. See
[ROADMAP.md](./ROADMAP.md) for what is deliberately still open.

## Licence

MIT. See [LICENSE](./LICENSE).
