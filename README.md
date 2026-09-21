# Facade UI

**The front of every great website.**

A free, open-source (MIT) registry of marketing sections, atoms and a design
system. You install a piece with the shadcn CLI and its **source lands in your
project** — there is no runtime package sitting between you and the markup.

```bash
pnpm dlx shadcn@latest add https://facadeui.dev/r/hero-split.json
```

Code quality, accessibility and composability are the product.

---

## What is in here

| Layer              | What it is                                                                                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tokens`, `themes` | Tailwind v4 token layer. shadcn-compatible colour names plus `--facade-*` display type, section rhythm and motion. Three presets: neutral, warm, vivid.                |
| Atoms              | `button`, `badge`, `heading`, `eyebrow`, `container`, `section`, `section-header`, `cta-group`, `stat`, `logo-mark`, `feature-icon`, `testimonial`, `pricing-tier`     |
| Motion             | `motion-primitives`: `FacadeMotionProvider`, `FadeIn`, `Reveal`, `Stagger`, `Collapse`, and the slot adapters the `-motion` sections use                               |
| Sections           | `nav-top`, three heroes, `logo-cloud`, `usp-list`, `feature-grid`, `feature-rows`, `bento-grid`, `faq-accordion`, `cta-band`, `footer` — each with a `-motion` variant |

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

- `pnpm contrast` resolves all six theme scopes (light/dark x three presets)
  from the real CSS and fails if a text pair drops below 4.5:1 or the focus ring
  below 3:1. It has already caught two real regressions.
- `pnpm e2e:a11y` runs axe-core over all 36 previews in all six scopes — 216
  checks. It found and forced a fix to `LogoMark`'s resting opacity, and an
  invalid `aria-orientation` Base UI puts on a `<ul>`.
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
pnpm registry:validate   # shadcn schema + Facade conventions
pnpm e2e:a11y           # axe, 6 theme scopes
pnpm e2e                # axe + visual regression
pnpm smoke              # install every item into a fresh Next.js project
```

`pnpm smoke` is the one worth knowing about: it scaffolds `create-next-app`,
runs `shadcn init`, serves the built registry over HTTP, installs every item
through the real shadcn CLI, and typechecks the result.

## Status

Phases 0 and 1 of the plan are complete: foundations, tooling, CI, tokens,
motion, 13 atoms, and the 12 core sections with motion variants. Phase 2
(breadth) and Phase 3 (templates, theme customiser) are not built yet —
see [ROADMAP.md](./ROADMAP.md).

## Licence

MIT. See [LICENSE](./LICENSE).
