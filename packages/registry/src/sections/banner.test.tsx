/** Dismissal has to work with and without persistence, and be announced right. */

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { Banner } from "@registry/sections/banner"

describe("Banner", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("is a named landmark that is not a live region by default", () => {
    render(<Banner label="Announcement">Facade UI v0.1 is out</Banner>)
    const region = screen.getByRole("region", { name: "Announcement" })
    expect(region).not.toHaveAttribute("aria-live")
  })

  it("becomes a live region only when asked", () => {
    render(
      <Banner label="Announcement" announce>
        Saved
      </Banner>,
    )
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite")
  })

  it("dismisses for the session with no storage key", async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(
      <Banner label="Announcement" dismissible onDismiss={onDismiss}>
        Facade UI v0.1 is out
      </Banner>,
    )

    await user.click(screen.getByRole("button", { name: "Dismiss announcement" }))
    expect(screen.queryByRole("region")).not.toBeInTheDocument()
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it("remembers a dismissal under a storage key", async () => {
    const user = userEvent.setup()
    const { unmount } = render(
      <Banner label="Announcement" dismissible storageKey="facade-test-banner">
        Facade UI v0.1 is out
      </Banner>,
    )

    await user.click(screen.getByRole("button", { name: "Dismiss announcement" }))
    expect(localStorage.getItem("facade-test-banner")).toBe("dismissed")
    unmount()

    render(
      <Banner label="Announcement" dismissible storageKey="facade-test-banner">
        Facade UI v0.1 is out
      </Banner>,
    )
    expect(screen.queryByRole("region")).not.toBeInTheDocument()
  })

  it("gives the dismiss button a name that says what it closes", () => {
    render(
      <Banner label="Cookie notice" dismissible>
        We use one cookie.
      </Banner>,
    )
    expect(
      screen.getByRole("button", { name: "Dismiss cookie notice" }),
    ).toBeInTheDocument()
  })
})
