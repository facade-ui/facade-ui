import { DocsSite } from "@registry/templates/docs-site"

import { DOCS_GROUPS, FOOTER_GROUPS, NAV_ITEMS } from "./content"

export function Demo() {
  return (
    <div className="-m-6 sm:-m-10">
      <DocsSite
        currentPath="#installation"
        content={{
          brand: "Facade UI",
          nav: NAV_ITEMS,
          navActions: [{ label: "Get started", href: "#start" }],
          sidebar: { label: "Documentation", groups: DOCS_GROUPS },
          page: {
            eyebrow: "Getting started",
            title: "Installation",
            description: "Add the tokens once, then install sections one at a time.",
            lastUpdated: { dateTime: "2026-09-21", label: "21 September 2026" },
          },
          toc: {
            items: [
              { label: "Requirements", href: "#requirements" },
              {
                label: "Install the tokens",
                href: "#tokens",
                children: [{ label: "Import the stylesheet", href: "#import" }],
              },
              { label: "Add a section", href: "#section" },
            ],
          },
          pagination: {
            prev: { label: "Introduction", href: "#introduction" },
            next: { label: "Theming", href: "#theming" },
          },
          footer: { groups: FOOTER_GROUPS, copyright: "© 2026 Facade UI contributors" },
        }}
      >
        <h2 id="requirements">Requirements</h2>
        <ul>
          <li>React 19 and Tailwind CSS v4</li>
          <li>
            A project set up with <code>shadcn init</code>
          </li>
        </ul>
        <h2 id="tokens">Install the tokens</h2>
        <p>Every section reads the same tokens, so they come first.</p>
        <pre>
          <code>npx shadcn@latest add @facade/tokens</code>
        </pre>
        <h3 id="import">Import the stylesheet</h3>
        <p>
          Import the file after Tailwind in your global stylesheet, so the tokens can
          override its defaults.
        </p>
        <pre>
          <code>@import &quot;./facade-tokens.css&quot;;</code>
        </pre>
        <h2 id="section">Add a section</h2>
        <p>
          Install any section by name. Its dependencies come with it, and the source lands
          in your project.
        </p>
      </DocsSite>
    </div>
  )
}
