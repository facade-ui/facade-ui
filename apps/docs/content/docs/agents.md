# For AI agents

This page tells an AI coding agent how to build a marketing page with Facade UI. It is also served as plain text at https://facadeui.dev/docs/agents.md, and the whole site is at https://facadeui.dev/llms.txt.

Using Claude (Claude Code, Cowork or the Claude apps)? Add the [Facade UI plugin](https://claude.ai/customize/plugins/id/86e8de8c-f5a8-41b7-937e-a8990b365185%40anthropic-plugin-directory) from the Claude directory: it gives Claude these instructions in every session.

## What Facade UI is

Facade UI is a set of sections and page templates for marketing websites: heroes, feature grids, pricing tables, FAQs, footers and complete pages. Each item is installed with the shadcn CLI, which copies its source into the project. It needs React 19, Tailwind CSS v4 and a project set up with `shadcn init`. Sections use shadcn's colour variable names, so they take an existing shadcn theme.

## Set up

1. Make sure `components.json` exists (`npx shadcn@latest init`).
2. If `@facade` is not resolved yet, add the registry to `components.json`:

```json
{
  "registries": {
    "@facade": "https://facadeui.dev/r/{name}.json"
  }
}
```

3. Install the tokens and import them after Tailwind:

```bash
npx shadcn@latest add @facade/tokens
```

```css
@import "tailwindcss";
@import "../styles/facade-tokens.css";
```

Every section needs the tokens file. If the project has its own theme, keep its colour variables below the import; they override the defaults.

## Find and install items

- Search: `npx shadcn@latest search @facade -q pricing`
- Read an item before using it: `npx shadcn@latest view @facade/pricing-tiers`, or fetch `https://facadeui.dev/components/pricing-tiers.md` for the props table and a usage example.
- Install: `npx shadcn@latest add @facade/pricing-tiers`. Dependencies are installed with it.
- Every item has a usage example as an installable item: `@facade/pricing-tiers-demo`.

Through the shadcn MCP server, the same steps are the `search_items_in_registries`, `view_items_in_registries`, `get_item_examples_from_registries` and `get_add_command_for_items` tools.

## Compose a page

A typical landing page, top to bottom: `nav-top`, a hero (`hero-split`, `hero-centered` or `hero-with-media`), `logo-cloud`, `usp-list` or `feature-grid`, `feature-rows` or `bento-grid`, `stats`, `testimonials-grid`, `pricing-tiers`, `faq-accordion`, `cta-band`, `footer`. Each section takes typed content props; put the content in one object and pass it down.

Rules that keep the page correct:

- **One `h1`.** Heroes default to `headingLevel={1}`; every other section defaults to `2`. Pass `headingLevel` when the section sits somewhere else in the outline. Visual size is a separate prop (`size`), so changing the level never changes the look.
- **Links and images.** Sections import nothing from `next/*`. Pass `link={Link}` (from `next/link`) and `image={Image}` (from `next/image`) where a section renders links or images from data. Pass the component, not a render function.
- **Icons.** Pass icon components from `lucide-react` (for example `icon: ZapIcon`). Static sections are server components; a `-motion` section or a template that receives icons must be rendered from a file marked `"use client"`.
- **Alt text.** Data-driven images take a required `alt`. Logos and avatars use `alt=""` because the name is shown as text beside them.
- **Prices.** Give `srPrice` ("29 dollars per month") next to the visible `price` ("$29").

## Templates

`saas-landing`, `agency` and `product-launch` are complete pages built from the sections above. Install one, render it from `app/page.tsx` with your own content object, and remove what you do not need. A template sets the outline for you: one `h1`, sections at `h2`.

```tsx
import { SaasLanding } from "@/components/templates/saas-landing"

import { content } from "./content"

export default function Page() {
  return <SaasLanding {...content} />
}
```

## Animation

Motion is optional. Every section has a static version (the default) and a `-motion` version. To use motion: install `@facade/motion-primitives`, render `FacadeMotionProvider` once near the root, then use the `-motion` items. Animations only touch `opacity` and `transform` and follow the user's reduced-motion setting.

## Theme

The default theme is Tailwind's orange on stone. Three presets ship in `@facade/themes` (`neutral`, `warm`, `vivid`), applied with `data-facade-theme` on `<html>`. To generate a theme from a brand colour, use the customiser at https://facadeui.dev/docs/customise and paste the CSS it exports. Keep `--primary` for fills, icons and focus rings, not for text.

## Check the result

Facade's own gate is: one `h1`, no skipped heading levels, every section named by its heading, contrast at 4.5:1 for text and 3:1 for focus rings and field borders. Run an axe scan on the finished page in light and dark mode.
