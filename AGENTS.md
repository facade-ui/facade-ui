# Facade UI — notes for coding agents working in this repository

Facade UI is a shadcn-compatible registry of sections and page templates for marketing websites. Users install items with the shadcn CLI (`@facade/<name>`); the source in `packages/registry/src` is what they get.

## Layout

- `packages/registry/src` — the items: `ui/` (atoms), `sections/`, `templates/`, `motion/`, `lib/`, `tokens/`. `packages/registry/registry.json` lists them.
- `apps/docs` — the docs site (Next.js 16). `demos/` holds one preview per item; `content/docs` holds the guides' markdown twins.
- `scripts/` — registry build, validator, props extraction, contrast check, markdown export, smoke install.
- `e2e/` — axe scans and visual snapshots.

## Rules

- Do not hand-edit `dependencies` or `registryDependencies` in `registry.json`; the build derives them (`pnpm registry:build`).
- Every registry file has a short JSDoc header with purpose, a11y notes and a `Dependencies:` line. Keep comments short.
- Sections import nothing from `next/*`. Links and images come in through `link` and `image` props.
- `headingLevel` is always a prop; visual size is separate.
- Animate only `opacity` and `transform`.
- `--primary` is never a text colour. Colour pairs must pass `pnpm contrast`.
- Keep commits and PRs small and grouped by concern, with short messages.

## The gate

```bash
pnpm lint && pnpm typecheck && pnpm test
pnpm contrast
pnpm registry:build --check && pnpm registry:validate
pnpm --filter @facade-ui/docs build
pnpm e2e:a11y
pnpm e2e:update   # only when a visual change is intended, then follow CONTRIBUTING.md for the Linux baselines
```

Guides for users of the library, including one written for agents, are at https://facadeui.dev/llms.txt.
