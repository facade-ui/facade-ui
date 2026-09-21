# Contributing

## Setup

```bash
pnpm install
pnpm dev          # docs site on :3000
```

## Adding a registry item

1. Write the component under `packages/registry/src/` — `ui/` for an atom,
   `sections/` for a section, `motion/` for a primitive.
2. Give it a JSDoc header with purpose, a11y notes, and a `Dependencies:` line.
   The validator enforces all three.
3. Add it to `packages/registry/registry.json` with `files` and an install
   `target`. **Do not write `dependencies` or `registryDependencies`** — they
   are derived from the real import graph by the build and written back in.
4. Add a demo at `apps/docs/demos/<name>.tsx` exporting `Demo`, and register it
   in `apps/docs/demos/index.ts`. That one entry gives the item a docs preview,
   an axe scan in six theme scopes, and visual snapshots.
5. Run the gate below.

## The gate

```bash
pnpm lint && pnpm typecheck && pnpm test
pnpm contrast
pnpm registry:build && pnpm registry:validate
pnpm --filter @facade-ui/docs build
pnpm e2e:a11y
pnpm e2e:update        # only if the visual change is intended
```

## Conventions the validator enforces

- Named exports only. No default exports outside the docs app.
- No `next/*` imports anywhere in the registry.
- Kebab-case, unprefixed item names — the registry URL already namespaces them.
- Every file has an install target, and no source file is left unshipped.

## Conventions it cannot enforce

- **Sections take typed data plus slots**, not forty props. If a section is
  growing a prop per visual detail, it wants composition instead.
- **`headingLevel` is always a prop**, and visual size is always separate.
- **Animate `opacity` and `transform` only.** `Collapse` is the one exception,
  and it is user-initiated.
- **A `<section>` needs an accessible name.** Render a `div` instead of adding a
  nameless landmark.
- **Reading order must match visual order.** Alternating layouts use
  `lg:order-*`, never a reordered DOM.

## Two things that will bite you

**Icons cannot cross a server-to-client boundary as props.** Icon libraries do
not mark their modules `"use client"`, so React refuses to serialise the
reference. Static sections are server components and are unaffected; anything
that renders a `-motion` variant, `FeatureTabs`, or a template while passing
icons needs `"use client"` on the file that passes them.

**Base UI's `render` prop cannot see through a wrapper component.** Passing
`render={<Button />}` to `Dialog.Trigger` logs a warning on every mount even
though the DOM ends up correct. Style the Base UI part with `buttonVariants`
instead. And never use `render` to turn a button component into a link — Base
UI emits `type="button"` on the anchor, or `role="button"` with
`nativeButton={false}`.

## Visual snapshots

Baselines are namespaced by platform under `e2e/__screenshots__/<platform>/`,
because macOS and the Linux CI container rasterise text differently. Both sets
are committed, and **a visual change means updating both**:

1. `pnpm e2e:update` for your own platform, and commit the result.
2. Push. The `visual` job fails on the Linux baselines, and uploads a
   `visual-diff` artifact.
3. Check the diffs in the HTML report. If the change is intended, take the
   `*-actual.png` files out of `test-results/`, drop the `-actual` suffix, and
   commit them over `e2e/__screenshots__/linux/`.

Step 3 is the only way to produce Linux baselines without Docker. With Docker
installed you can skip the round trip:

```bash
docker run --rm -v "$PWD":/w -w /w mcr.microsoft.com/playwright:v1.63.0-noble   bash -c "corepack enable && pnpm install --frozen-lockfile && pnpm --filter @facade-ui/docs build && pnpm exec playwright test e2e/visual.spec.ts --update-snapshots"
```
