/** Validation, server errors and the announced outcome are the section's job. */

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { ContactForm, type ContactField } from "@registry/sections/contact-form"

const fields: ContactField[] = [
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  {
    name: "topic",
    label: "Topic",
    type: "select",
    options: [
      { value: "sales", label: "Sales" },
      { value: "support", label: "Support" },
    ],
  },
  { name: "message", label: "Message", type: "textarea" },
]

const describedText = (element: HTMLElement) =>
  (element.getAttribute("aria-describedby") ?? "")
    .split(" ")
    .map((token) => document.getElementById(token)?.textContent)
    .join(" ")

describe("ContactForm", () => {
  it("is a form named by its heading", () => {
    render(<ContactForm title="Get in touch" fields={fields} headingLevel={2} />)
    expect(screen.getByRole("heading", { level: 2, name: "Get in touch" })).toBeVisible()
    expect(screen.getByRole("form", { name: "Get in touch" })).toBeInTheDocument()
  })

  it("stops an empty submit, explains why and focuses the first problem", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ContactForm title="Get in touch" fields={fields} onSubmit={onSubmit} />)

    await user.click(screen.getByRole("button", { name: "Send message" }))

    expect(onSubmit).not.toHaveBeenCalled()
    const name = screen.getByLabelText(/^Name/)
    expect(name).toHaveFocus()
    expect(name).toHaveAttribute("aria-invalid", "true")
    // The browser's own message, not an empty error.
    expect(describedText(name).trim()).not.toBe("")
  })

  it("passes every value, the select included, once the checks pass", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<ContactForm title="Get in touch" fields={fields} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/^Name/), "Rosa")
    await user.type(screen.getByLabelText(/^Email/), "rosa@example.com")
    // A click, not Enter: in jsdom, Enter on an option inside Base UI's Form
    // selects nothing, though it does in a browser. The trigger also ignores a
    // pointer release in the first 200ms after opening.
    await user.click(screen.getByRole("combobox", { name: "Topic" }))
    await screen.findByRole("listbox")
    await new Promise((resolve) => setTimeout(resolve, 250))
    await user.click(screen.getByRole("option", { name: "Support" }))
    await user.type(screen.getByLabelText("Message"), "Hello")
    await user.click(screen.getByRole("button", { name: "Send message" }))

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Rosa",
      email: "rosa@example.com",
      topic: "support",
      message: "Hello",
    })
  })

  it("shows server errors on their fields and focuses the first", async () => {
    render(
      <ContactForm
        title="Get in touch"
        fields={fields}
        status="error"
        errors={{ email: "That address bounced.", message: "Too short." }}
      />,
    )

    const email = screen.getByLabelText(/^Email/)
    await waitFor(() => expect(email).toHaveFocus())
    expect(email).toHaveAttribute("aria-invalid", "true")
    expect(describedText(email)).toContain("That address bounced.")
    expect(describedText(screen.getByLabelText("Message"))).toContain("Too short.")
  })

  it("clears a server error once its field is edited, so it can be sent again", async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <ContactForm
        title="Get in touch"
        fields={fields}
        status="error"
        errors={{ email: "That address bounced." }}
        onSubmit={onSubmit}
      />,
    )

    await user.type(screen.getByLabelText(/^Name/), "Rosa")
    const email = screen.getByLabelText(/^Email/)
    await user.clear(email)
    await user.type(email, "rosa@northwind.test")

    expect(email).not.toHaveAttribute("aria-invalid")
    expect(screen.queryByText("That address bounced.")).toBeNull()

    await user.click(screen.getByRole("button", { name: "Send message" }))
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ email: "rosa@northwind.test" }),
    )
  })

  it("announces the outcome in a live region that is always there", () => {
    const { rerender, container } = render(
      <ContactForm title="Get in touch" fields={fields} />,
    )
    const region = container.querySelector('[aria-live="polite"]')
    expect(region).toBeEmptyDOMElement()

    rerender(
      <ContactForm
        title="Get in touch"
        fields={fields}
        status="success"
        successMessage="Sent."
      />,
    )
    expect(region).toHaveTextContent("Sent.")
  })

  it("keeps the button's name while sending", () => {
    render(<ContactForm title="Get in touch" fields={fields} status="submitting" />)
    const button = screen.getByRole("button", { name: /Send message/ })
    expect(button).toHaveAttribute("aria-busy", "true")
  })

  it("reads each contact detail with its label", () => {
    render(
      <ContactForm
        title="Get in touch"
        fields={fields}
        details={[
          {
            label: "Email",
            value: "hello@example.com",
            href: "mailto:hello@example.com",
          },
        ]}
      />,
    )
    expect(screen.getByRole("term")).toHaveTextContent("Email")
    expect(screen.getByRole("link", { name: "hello@example.com" })).toHaveAttribute(
      "href",
      "mailto:hello@example.com",
    )
  })
})
