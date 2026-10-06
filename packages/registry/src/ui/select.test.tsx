/** The Field wiring and keyboard use are why this atom exists, so both are pinned. */

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { Select } from "@registry/ui/select"

const countries = [
  { value: "nl", label: "Netherlands" },
  { value: "de", label: "Germany" },
  { value: "xx", label: "Atlantis", disabled: true },
]

const describedText = (element: HTMLElement) =>
  (element.getAttribute("aria-describedby") ?? "")
    .split(" ")
    .map((token) => document.getElementById(token)?.textContent)
    .join(" ")

describe("Select", () => {
  it("names the trigger with the label", () => {
    render(<Select label="Country" items={countries} />)
    // getByLabelText would also match the hidden input, so query by role.
    const trigger = screen.getByRole("combobox", { name: "Country" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  it("keeps a hidden label in the accessibility tree", () => {
    render(<Select label="Country" hideLabel items={countries} />)
    expect(screen.getByRole("combobox", { name: "Country" })).toBeInTheDocument()
    expect(screen.getByText("Country")).toHaveClass("sr-only")
  })

  it("submits through a hidden input", () => {
    const { container } = render(
      <Select
        label="Country"
        name="country"
        defaultValue="de"
        items={countries}
        required
      />,
    )
    const input = container.querySelector('input[name="country"]')
    expect(input).toHaveValue("de")
    expect(input).toBeRequired()
  })

  it("says 'required' in words", () => {
    render(<Select label="Country" items={countries} required />)
    // jsdom's name computation trims the span's leading space; browsers keep it.
    expect(
      screen.getByRole("combobox", { name: /Country\s*\(required\)/ }),
    ).toBeInTheDocument()
  })

  it("shows the placeholder until something is chosen", () => {
    render(<Select label="Country" items={countries} placeholder="Pick a country" />)
    const trigger = screen.getByRole("combobox", { name: "Country" })
    expect(trigger).toHaveTextContent("Pick a country")
    expect(trigger).toHaveAttribute("data-placeholder")
  })

  it("associates the description with the trigger", () => {
    render(<Select label="Country" items={countries} description="For the invoice." />)
    const trigger = screen.getByRole("combobox", { name: "Country" })
    expect(describedText(trigger)).toContain("For the invoice.")
  })

  it("marks the trigger invalid and describes it with an external error", () => {
    render(<Select label="Country" items={countries} error="Choose a country." />)
    const trigger = screen.getByRole("combobox", { name: "Country" })
    expect(trigger).toHaveAttribute("aria-invalid", "true")
    expect(describedText(trigger)).toContain("Choose a country.")
  })

  it("is not marked invalid without an error", () => {
    render(<Select label="Country" items={countries} />)
    expect(screen.getByRole("combobox", { name: "Country" })).not.toHaveAttribute(
      "aria-invalid",
    )
  })

  it("opens and chooses an option from the keyboard", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <Select label="Country" name="country" items={countries} />,
    )
    const trigger = screen.getByRole("combobox", { name: "Country" })

    trigger.focus()
    await user.keyboard("{ArrowDown}")
    await screen.findByRole("listbox")

    const options = screen.getAllByRole("option")
    expect(options).toHaveLength(3)
    expect(screen.getByRole("option", { name: "Atlantis" })).toHaveAttribute(
      "aria-disabled",
      "true",
    )

    // Keyboard rather than a click: the trigger ignores a mouseup just after opening.
    await user.keyboard("{ArrowDown}{Enter}")
    expect(container.querySelector('input[name="country"]')).toHaveValue("de")
    expect(trigger).toHaveTextContent("Germany")
  })
})
