/** The label/description/error wiring is the whole reason this atom exists. */

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Input } from "@registry/ui/input"

describe("Input", () => {
  it("associates the label with the control", () => {
    render(<Input label="Email address" type="email" />)
    expect(screen.getByLabelText("Email address")).toHaveAttribute("type", "email")
  })

  it("keeps a hidden label in the accessibility tree", () => {
    render(<Input label="Email address" hideLabel placeholder="you@example.com" />)
    const input = screen.getByLabelText("Email address")
    expect(input).toHaveAttribute("placeholder", "you@example.com")
    expect(screen.getByText("Email address")).toHaveClass("sr-only")
  })

  it("says 'required' in words rather than with an asterisk alone", () => {
    render(<Input label="Email address" required />)
    expect(screen.getByLabelText(/Email address \(required\)/)).toBeRequired()
  })

  it("associates the description with the control", () => {
    render(<Input label="Email address" description="We only send the changelog." />)
    const input = screen.getByLabelText("Email address")
    const describedBy = input.getAttribute("aria-describedby")
    expect(describedBy).toBeTruthy()
    expect(document.getElementById(describedBy!.split(" ")[0]!)).toHaveTextContent(
      "We only send the changelog.",
    )
  })

  it("marks the control invalid and describes it with an external error", () => {
    render(<Input label="Email address" error="That address is not valid." />)

    const input = screen.getByLabelText("Email address")
    // Base UI derives aria-invalid from ValidityState, which knows nothing
    // about a server-side error, so the atom sets it.
    expect(input).toHaveAttribute("aria-invalid", "true")

    const describedBy = input.getAttribute("aria-describedby")
    expect(describedBy).toBeTruthy()
    const described = describedBy!
      .split(" ")
      .map((token) => document.getElementById(token)?.textContent)
      .join(" ")
    expect(described).toContain("That address is not valid.")
  })

  it("is not marked invalid without an error", () => {
    render(<Input label="Email address" />)
    expect(screen.getByLabelText("Email address")).not.toHaveAttribute("aria-invalid")
  })
})
