import type { Metadata } from "next"
import Link from "next/link"

import { CodeBlock } from "@/components/code-block"
import { Prose } from "@/components/prose"

export const metadata: Metadata = {
  title: "For AI agents",
  description:
    "How an AI coding agent sets up Facade UI, finds items, and composes an accessible marketing page from its sections.",
  alternates: {
    canonical: "/docs/agents",
    types: { "text/markdown": "/docs/agents.md" },
  },
}

export default function AgentsPage() {
  return (
    <Prose>
      <h1 className="text-display-sm font-semibold">For AI agents</h1>
      <p>
        This page tells an AI coding agent how to build a marketing page with Facade UI.
        It is also served as plain text at <code>/docs/agents.md</code>, and the whole
        site is indexed at <code>/llms.txt</code>.
      </p>
      <p>
        Using Claude (Claude Code, Cowork or the Claude apps)? Add the{" "}
        <a href="https://claude.ai/customize/plugins/id/86e8de8c-f5a8-41b7-937e-a8990b365185%40anthropic-plugin-directory">
          Facade UI plugin
        </a>{" "}
        from the Claude directory: it gives Claude these instructions in every session.
      </p>

      <h2>What Facade UI is</h2>
      <p>
        Facade UI is a set of sections and page templates for marketing websites: heroes,
        feature grids, pricing tables, FAQs, footers and complete pages. Each item is
        installed with the shadcn CLI, which copies its source into the project. It needs
        React 19, Tailwind CSS v4 and a project set up with <code>shadcn init</code>.
        Sections use shadcn&apos;s colour variable names, so they take an existing shadcn
        theme.
      </p>

      <h2>Set up</h2>
      <ol>
        <li>
          Make sure <code>components.json</code> exists (
          <code>npx shadcn@latest init</code>). <code>@facade</code> is in the shadcn
          registry directory, so it needs no configuration.
        </li>
        <li>Install the tokens and import them after Tailwind:</li>
      </ol>
      <CodeBlock
        lang="bash"
        filename="terminal"
        code="npx shadcn@latest add @facade/tokens"
      />
      <CodeBlock
        lang="css"
        filename="app/globals.css"
        code={`@import "tailwindcss";
@import "../styles/facade-tokens.css";`}
      />
      <p>
        Every section needs the tokens file. If the project has its own theme, keep its
        colour variables below the import; they override the defaults.
      </p>

      <h2>Find and install items</h2>
      <ul>
        <li>
          Search: <code>npx shadcn@latest search @facade -q pricing</code>
        </li>
        <li>
          Read an item before using it:{" "}
          <code>npx shadcn@latest view @facade/pricing-tiers</code>, or fetch{" "}
          <code>/components/pricing-tiers.md</code> for the props table and a usage
          example.
        </li>
        <li>
          Install: <code>npx shadcn@latest add @facade/pricing-tiers</code>. Dependencies
          are installed with it.
        </li>
        <li>
          Every item has a usage example as an installable item:{" "}
          <code>@facade/pricing-tiers-demo</code>.
        </li>
      </ul>
      <p>
        Through the shadcn MCP server, the same steps are the{" "}
        <code>search_items_in_registries</code>, <code>view_items_in_registries</code>,{" "}
        <code>get_item_examples_from_registries</code> and{" "}
        <code>get_add_command_for_items</code> tools.
      </p>

      <h2>Compose a page</h2>
      <p>
        A typical landing page, top to bottom: <code>nav-top</code>, a hero (
        <code>hero-split</code>, <code>hero-centered</code> or{" "}
        <code>hero-with-media</code>), <code>logo-cloud</code>, <code>usp-list</code> or{" "}
        <code>feature-grid</code>, <code>feature-rows</code> or <code>bento-grid</code>,{" "}
        <code>stats</code>, <code>testimonials-grid</code>, <code>pricing-tiers</code>,{" "}
        <code>faq-accordion</code>, <code>cta-band</code>, <code>footer</code>. Each
        section takes typed content props; put the content in one object and pass it down.
      </p>
      <p>Rules that keep the page correct:</p>
      <ul>
        <li>
          <strong>One h1.</strong> Heroes default to <code>headingLevel={"{1}"}</code>;
          every other section defaults to <code>2</code>. Pass <code>headingLevel</code>{" "}
          when the section sits somewhere else in the outline. Visual size is a separate
          prop (<code>size</code>), so changing the level never changes the look.
        </li>
        <li>
          <strong>Links and images.</strong> Sections import nothing from{" "}
          <code>next/*</code>. Pass <code>link={"{Link}"}</code> and{" "}
          <code>image={"{Image}"}</code> where a section renders links or images from
          data. Pass the component, not a render function.
        </li>
        <li>
          <strong>Icons.</strong> Pass icon components from <code>lucide-react</code>.
          Static sections are server components; a <code>-motion</code> section or a
          template that receives icons must be rendered from a file marked{" "}
          <code>&quot;use client&quot;</code>.
        </li>
        <li>
          <strong>Alt text.</strong> Data-driven images take a required <code>alt</code>.
          Logos and avatars use <code>alt=&quot;&quot;</code> because the name is shown as
          text beside them.
        </li>
        <li>
          <strong>Prices.</strong> Give <code>srPrice</code> (&quot;29 dollars per
          month&quot;) next to the visible <code>price</code> (&quot;$29&quot;).
        </li>
      </ul>

      <h2>Templates</h2>
      <p>
        <code>saas-landing</code>, <code>agency</code>, <code>product-launch</code>,{" "}
        <code>changelog</code> and <code>docs-site</code> are complete pages built from
        the sections above. Install one, render it from <code>app/page.tsx</code> with
        your own content object, and remove what you do not need. A template sets the
        outline for you: one <code>h1</code>, sections at <code>h2</code>.
      </p>
      <CodeBlock
        filename="app/page.tsx"
        code={`import { SaasLanding } from "@/components/templates/saas-landing"

import { content } from "./content"

export default function Page() {
  return <SaasLanding {...content} />
}`}
      />

      <h2>Animation</h2>
      <p>
        Motion is optional. Every section has a static version (the default) and a{" "}
        <code>-motion</code> version. To use motion: install{" "}
        <code>@facade/motion-primitives</code>, render <code>FacadeMotionProvider</code>{" "}
        once near the root, then use the <code>-motion</code> items. Animations only touch{" "}
        <code>opacity</code> and <code>transform</code> and follow the user&apos;s
        reduced-motion setting.
      </p>

      <h2>Theme</h2>
      <p>
        The default theme is Tailwind&apos;s orange on stone. Three presets ship in{" "}
        <code>@facade/themes</code> (<code>neutral</code>, <code>warm</code>,{" "}
        <code>vivid</code>), applied with <code>data-facade-theme</code> on{" "}
        <code>&lt;html&gt;</code>. To generate a theme from a brand colour, use the{" "}
        <Link href="/docs/customise">customiser</Link> and paste the CSS it exports. Keep{" "}
        <code>--primary</code> for fills, icons and focus rings, not for text.
      </p>

      <h2>Check the result</h2>
      <p>
        Facade&apos;s own gate is: one <code>h1</code>, no skipped heading levels, every
        section named by its heading, contrast at 4.5:1 for text and 3:1 for focus rings
        and field borders. Run an axe scan on the finished page in light and dark mode.
      </p>
    </Prose>
  )
}
