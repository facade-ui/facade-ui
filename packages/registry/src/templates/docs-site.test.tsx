/** The page outline and the three named navigations are the template's job. */

import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DocsSite, type DocsSiteContent } from "@registry/templates/docs-site"

const content: DocsSiteContent = {
  brand: "Acme",
  nav: [{ label: "Docs", href: "/docs" }],
  sidebar: {
    groups: [
      {
        title: "Getting started",
        links: [
          { label: "Introduction", href: "/docs" },
          { label: "Installation", href: "/docs/installation" },
        ],
      },
    ],
  },
  page: { title: "Installation", description: "Set it up." },
  toc: { items: [{ label: "Requirements", href: "#requirements" }] },
  pagination: {
    prev: { label: "Introduction", href: "/docs" },
    next: { label: "Theming", href: "/docs/theming" },
  },
  footer: {},
}

describe("DocsSite", () => {
  it("has exactly one h1, naming the article", () => {
    render(
      <DocsSite content={content} currentPath="/docs/installation">
        <h2 id="requirements">Requirements</h2>
      </DocsSite>,
    )
    const [h1, ...rest] = screen.getAllByRole("heading", { level: 1 })
    expect(rest).toHaveLength(0)
    expect(h1).toHaveTextContent("Installation")
    expect(screen.getByRole("article", { name: "Installation" })).toBeInTheDocument()
  })

  it("names every navigation and marks the current page", () => {
    render(
      <DocsSite content={content} currentPath="/docs/installation">
        <p>Body</p>
      </DocsSite>,
    )
    const sidebar = screen.getAllByRole("navigation", { name: "Documentation" })[0]!
    expect(within(sidebar).getByRole("link", { name: "Installation" })).toHaveAttribute(
      "aria-current",
      "page",
    )
    expect(screen.getByRole("navigation", { name: "On this page" })).toBeInTheDocument()

    const pages = screen.getByRole("navigation", { name: "Pages" })
    expect(
      within(pages).getByRole("link", { name: /Previous\s*Introduction/ }),
    ).toHaveAttribute("rel", "prev")
    expect(within(pages).getByRole("link", { name: /Next\s*Theming/ })).toHaveAttribute(
      "rel",
      "next",
    )
  })

  it("leaves out pagination and the page list when there are none", () => {
    render(
      <DocsSite content={{ ...content, toc: undefined, pagination: undefined }}>
        <p>Body</p>
      </DocsSite>,
    )
    expect(screen.queryByRole("navigation", { name: "Pages" })).toBeNull()
    expect(screen.queryByRole("navigation", { name: "On this page" })).toBeNull()
  })
})
