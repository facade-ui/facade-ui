/** The selected tab's styling hook, pinned because a wrong selector fails silently. */

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { FeatureTabs } from "@registry/sections/feature-tabs"

const items = [
  { label: "Build", description: "Compose sections." },
  { label: "Ship", description: "Install with the shadcn CLI." },
]

describe("FeatureTabs", () => {
  it("marks the selected tab with data-active, which its text colour targets", async () => {
    const user = userEvent.setup()
    render(<FeatureTabs items={items} />)

    const build = screen.getByRole("tab", { name: "Build" })
    const ship = screen.getByRole("tab", { name: "Ship" })
    expect(build).toHaveAttribute("data-active")
    expect(ship).not.toHaveAttribute("data-active")
    expect(build.className).toContain("data-[active]:text-foreground")

    await user.click(ship)
    expect(ship).toHaveAttribute("data-active")
    expect(build).not.toHaveAttribute("data-active")
  })
})
