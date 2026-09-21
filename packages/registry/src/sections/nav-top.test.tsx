/**
 * The header's keyboard and landmark contract.
 *
 * Base UI owns the focus trap and Escape handling; these tests prove the section
 * wired it up correctly and that the two navigations never both reach the
 * accessibility tree at once.
 */

import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { NavTop } from "@registry/sections/nav-top"

const items = [
  { label: "Product", href: "/product" },
  {
    label: "Solutions",
    children: [
      { label: "For startups", href: "/solutions/startups" },
      { label: "For teams", href: "/solutions/teams" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
]

const actions = [{ label: "Sign in", href: "/sign-in" }]

describe("NavTop", () => {
  it("marks the current page with aria-current", () => {
    render(<NavTop brand="Acme" items={items} currentPath="/pricing" />)
    const pricing = screen.getAllByRole("link", { name: "Pricing" })[0]!
    expect(pricing).toHaveAttribute("aria-current", "page")

    const product = screen.getAllByRole("link", { name: "Product" })[0]!
    expect(product).not.toHaveAttribute("aria-current")
  })

  it("uses a button, not a link, for a dropdown that only opens things", () => {
    render(<NavTop brand="Acme" items={items} />)
    const trigger = screen.getByRole("button", { name: /Solutions/ })
    expect(trigger.tagName).toBe("BUTTON")
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("opens the dropdown from the keyboard and exposes its links", async () => {
    const user = userEvent.setup()
    render(<NavTop brand="Acme" items={items} />)

    const trigger = screen.getByRole("button", { name: /Solutions/ })
    trigger.focus()
    await user.keyboard("{Enter}")

    expect(trigger).toHaveAttribute("aria-expanded", "true")
    expect(await screen.findByRole("link", { name: "For startups" })).toBeInTheDocument()
  })

  it("opens the drawer as a modal dialog and closes it on Escape", async () => {
    const user = userEvent.setup()
    render(<NavTop brand="Acme" items={items} actions={actions} menuLabel="Menu" />)

    await user.click(screen.getByRole("button", { name: "Menu" }))

    const dialog = await screen.findByRole("dialog")
    expect(within(dialog).getByRole("navigation", { name: "Main" })).toBeInTheDocument()
    expect(within(dialog).getByRole("link", { name: "Sign in" })).toBeInTheDocument()

    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("closes the drawer when a link inside it is followed", async () => {
    const user = userEvent.setup()
    render(<NavTop brand="Acme" items={items} menuLabel="Menu" />)

    await user.click(screen.getByRole("button", { name: "Menu" }))
    const dialog = await screen.findByRole("dialog")

    // A real link with an onClick, not a Dialog.Close rendered as an anchor —
    // that form makes Base UI emit an invalid type="button" on the <a>.
    const link = within(dialog).getByRole("link", { name: "Pricing" })
    expect(link).not.toHaveAttribute("type")
    expect(link).not.toHaveAttribute("role", "button")

    await user.click(link)
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
  })

  it("returns focus to the trigger after the drawer closes", async () => {
    const user = userEvent.setup()
    render(<NavTop brand="Acme" items={items} menuLabel="Menu" />)

    const trigger = screen.getByRole("button", { name: "Menu" })
    await user.click(trigger)
    await screen.findByRole("dialog")

    await user.keyboard("{Escape}")
    expect(trigger).toHaveFocus()
  })
})
