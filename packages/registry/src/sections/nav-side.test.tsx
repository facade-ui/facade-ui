/** Navigating must not reshuffle the groups or make Base UI log an error. */

import { render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { NavSide } from "@registry/sections/nav-side"

const groups = [
  {
    title: "Atoms",
    collapsible: true,
    links: [{ label: "Button", href: "/button" }],
  },
  {
    title: "Templates",
    collapsible: true,
    defaultCollapsed: true,
    links: [{ label: "Changelog", href: "/changelog" }],
  },
]

describe("NavSide", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("opens a collapsed group that holds the current page", () => {
    render(<NavSide groups={groups} currentPath="/changelog" />)
    expect(screen.getByRole("button", { name: "Templates" })).toHaveAttribute(
      "aria-expanded",
      "true",
    )
  })

  it("keeps each group as it was when the current page changes", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)
    const { rerender } = render(<NavSide groups={groups} currentPath="/button" />)
    expect(screen.getByRole("button", { name: "Templates" })).toHaveAttribute(
      "aria-expanded",
      "false",
    )

    rerender(<NavSide groups={groups} currentPath="/changelog" />)

    expect(screen.getByRole("button", { name: "Templates" })).toHaveAttribute(
      "aria-expanded",
      "false",
    )
    // The page moved on, so the open group's link is no longer current.
    expect(screen.getByRole("link", { name: "Button" })).not.toHaveAttribute(
      "aria-current",
    )
    expect(error).not.toHaveBeenCalled()
  })
})
