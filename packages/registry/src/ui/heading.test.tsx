/** The outline level must follow the prop, never the visual size. */

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Heading } from "./heading"
import { SectionHeader } from "./section-header"

describe("Heading", () => {
  it.each([1, 2, 3, 4, 5, 6] as const)(
    "renders level %i as the matching tag",
    (level) => {
      render(<Heading level={level}>Pricing</Heading>)
      expect(screen.getByRole("heading", { level, name: "Pricing" })).toBeInTheDocument()
    },
  )
})

describe("SectionHeader", () => {
  it("keeps visual size independent of outline level", () => {
    render(<SectionHeader title="Built for teams" headingLevel={4} size="xl" />)
    const heading = screen.getByRole("heading", { level: 4, name: "Built for teams" })
    expect(heading.className).toContain("text-display-lg")
  })

  it("gives the heading a stable id for aria-labelledby", () => {
    render(<SectionHeader title="Built for teams" />)
    expect(screen.getByRole("heading", { name: "Built for teams" })).toHaveAttribute(
      "id",
      "facade-built-for-teams",
    )
  })

  it("renders the eyebrow as a paragraph, not a heading", () => {
    render(<SectionHeader eyebrow="Platform" title="Built for teams" />)
    expect(screen.getAllByRole("heading")).toHaveLength(1)
    expect(screen.getByText("Platform").tagName).toBe("P")
  })
})
