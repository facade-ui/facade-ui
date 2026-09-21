/** Behaviour that the styling must never quietly break. */

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Button, buttonVariants } from "@registry/ui/button"

describe("Button", () => {
  it("renders a native button and fires on click and on Enter", async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<Button onClick={onClick}>Get started</Button>)

    const button = screen.getByRole("button", { name: "Get started" })
    expect(button.tagName).toBe("BUTTON")

    await user.click(button)
    button.focus()
    await user.keyboard("{Enter}")
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it("gives a non-button element full button semantics via render", async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <Button render={<span />} nativeButton={false} onClick={onClick}>
        Toggle
      </Button>,
    )

    const control = screen.getByRole("button", { name: "Toggle" })
    expect(control.tagName).toBe("SPAN")
    expect(control).toHaveAttribute("tabindex", "0")

    control.focus()
    await user.keyboard("{ }")
    expect(onClick).toHaveBeenCalled()
  })

  it("documents why links must not go through render", () => {
    // Pins the Base UI behaviour the JSDoc warns about, so an upstream change
    // that fixes it shows up here rather than silently outdating the guidance.
    const { container } = render(
      <Button render={<a href="/pricing" />}>See pricing</Button>,
    )
    const anchor = container.querySelector("a")!
    expect(anchor).toHaveAttribute("type", "button")

    // The supported way to style a link as a button:
    render(
      <a href="/pricing" className={buttonVariants({ variant: "outline" })}>
        Pricing
      </a>,
    )
    const link = screen.getByRole("link", { name: "Pricing" })
    expect(link.className).toContain("border-border")
  })

  it("marks itself busy and blocks activation while loading", async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <Button loading loadingLabel="Saving" onClick={onClick}>
        Save
      </Button>,
    )

    const button = screen.getByRole("button", { name: /Save/ })
    expect(button).toHaveAttribute("aria-busy", "true")
    expect(screen.getByText("Saving")).toBeInTheDocument()

    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it("keeps the caller's className winning over the variant's", () => {
    render(<Button className="bg-red-500">Danger</Button>)
    const classes = screen.getByRole("button", { name: "Danger" }).className.split(/\s+/)
    expect(classes).toContain("bg-red-500")
    // tailwind-merge drops the conflicting base colour but leaves the hover state,
    // which is a different utility and not in conflict.
    expect(classes).not.toContain("bg-primary")
    expect(classes).toContain("hover:bg-primary/90")
  })
})
