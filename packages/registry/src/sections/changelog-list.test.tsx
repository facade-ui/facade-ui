/** Each release must be a named, linkable article with its kinds in words. */

import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ChangelogList } from "@registry/sections/changelog-list"

const releases = [
  {
    version: "v0.3.0",
    title: "Templates",
    dateTime: "2026-09-21",
    dateLabel: "21 September 2026",
    href: "#v030",
    changes: [
      { kind: "added" as const, description: "Three page templates." },
      { kind: "fixed" as const, description: "Contrast of the light input border." },
    ],
  },
  {
    version: "v0.2.0",
    title: "Breadth sections",
    dateTime: "2026-09-14",
    dateLabel: "14 September 2026",
    changes: [{ kind: "removed" as const, description: "The old hero." }],
  },
]

describe("ChangelogList", () => {
  it("makes each release an article named by a heading one level down", () => {
    render(<ChangelogList title="Changelog" items={releases} headingLevel={2} />)
    expect(screen.getByRole("heading", { level: 2, name: "Changelog" })).toBeVisible()
    const article = screen.getByRole("article", { name: "Templates" })
    expect(
      within(article).getByRole("heading", { level: 3, name: "Templates" }),
    ).toBeVisible()
  })

  it("honours an explicit item heading level", () => {
    render(<ChangelogList items={releases} itemHeadingLevel={2} />)
    expect(
      screen.getByRole("heading", { level: 2, name: "Breadth sections" }),
    ).toBeVisible()
  })

  it("gives each release a stable anchor and a machine-readable date", () => {
    render(<ChangelogList items={releases} />)
    const article = screen.getByRole("article", { name: "Templates" })
    expect(article).toHaveAttribute("id", "release-v0-3-0")
    expect(within(article).getByText("21 September 2026")).toHaveAttribute(
      "datetime",
      "2026-09-21",
    )
  })

  it("names the kind of each change in words, and lets you translate them", () => {
    const { rerender } = render(<ChangelogList items={releases} />)
    expect(screen.getByText("Added")).toBeVisible()
    expect(screen.getByText("Removed")).toBeVisible()

    rerender(<ChangelogList items={releases} kindLabels={{ added: "Nieuw" }} />)
    expect(screen.getByText("Nieuw")).toBeVisible()
    expect(screen.getByText("Fixed")).toBeVisible()
  })

  it("links the title only when there is an href", () => {
    render(<ChangelogList items={releases} />)
    expect(screen.getByRole("link", { name: "Templates" })).toHaveAttribute(
      "href",
      "#v030",
    )
    expect(screen.queryByRole("link", { name: "Breadth sections" })).toBeNull()
  })
})
