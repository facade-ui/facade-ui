/** The Field wiring has to survive rendering a textarea instead of an input. */

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Textarea } from "@registry/ui/textarea"

const describedText = (element: HTMLElement) =>
  (element.getAttribute("aria-describedby") ?? "")
    .split(" ")
    .map((token) => document.getElementById(token)?.textContent)
    .join(" ")

describe("Textarea", () => {
  it("associates the label with a textarea", () => {
    render(<Textarea label="Message" />)
    const field = screen.getByLabelText("Message")
    expect(field.tagName).toBe("TEXTAREA")
    expect(field).toHaveAttribute("rows", "4")
  })

  it("passes rows, name and defaultValue to the textarea", () => {
    render(<Textarea label="Message" name="message" rows={8} defaultValue="Hello" />)
    const field = screen.getByLabelText("Message")
    expect(field).toHaveAttribute("rows", "8")
    expect(field).toHaveAttribute("name", "message")
    expect(field).toHaveValue("Hello")
  })

  it("keeps a hidden label in the accessibility tree", () => {
    render(<Textarea label="Message" hideLabel placeholder="Anything else?" />)
    expect(screen.getByLabelText("Message")).toHaveAttribute(
      "placeholder",
      "Anything else?",
    )
    expect(screen.getByText("Message")).toHaveClass("sr-only")
  })

  it("says 'required' in words rather than with an asterisk alone", () => {
    render(<Textarea label="Message" required />)
    expect(screen.getByLabelText(/Message \(required\)/)).toBeRequired()
  })

  it("associates the description with the textarea", () => {
    render(<Textarea label="Message" description="Tell us what you are building." />)
    expect(describedText(screen.getByLabelText("Message"))).toContain(
      "Tell us what you are building.",
    )
  })

  it("marks the textarea invalid and describes it with an external error", () => {
    render(<Textarea label="Message" error="Keep it under 500 characters." />)
    const field = screen.getByLabelText("Message")
    expect(field).toHaveAttribute("aria-invalid", "true")
    expect(describedText(field)).toContain("Keep it under 500 characters.")
  })

  it("is not marked invalid without an error", () => {
    render(<Textarea label="Message" />)
    expect(screen.getByLabelText("Message")).not.toHaveAttribute("aria-invalid")
  })

  it("can turn off resizing", () => {
    const { rerender } = render(<Textarea label="Message" />)
    expect(screen.getByLabelText("Message")).toHaveClass("resize-y")
    rerender(<Textarea label="Message" resize="none" />)
    expect(screen.getByLabelText("Message")).toHaveClass("resize-none")
  })
})
