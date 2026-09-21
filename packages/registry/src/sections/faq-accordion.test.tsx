/**
 * The FAQ's accessibility contract, pinned.
 *
 * Base UI owns aria-expanded and focus management; what is checked here is what
 * this section decides: real buttons inside real headings at the right level,
 * find-in-page reachability for closed answers, and a decorative chevron.
 */

import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { FaqAccordion } from "@registry/sections/faq-accordion"

const items = [
  { question: "Is it free?", answer: "Yes. MIT licensed, with nothing gated." },
  { question: "Does it need Next.js?", answer: "No. Nothing imports from next/*." },
]

describe("FaqAccordion", () => {
  it("puts every question in a button inside a heading", () => {
    render(<FaqAccordion title="Questions" items={items} headingLevel={2} />)

    expect(
      screen.getByRole("heading", { level: 2, name: "Questions" }),
    ).toBeInTheDocument()
    for (const item of items) {
      const heading = screen.getByRole("heading", { level: 3, name: item.question })
      expect(heading.querySelector("button")).not.toBeNull()
    }
  })

  it("derives the question heading level from the section's", () => {
    render(<FaqAccordion title="Questions" items={items} headingLevel={3} />)
    expect(
      screen.getByRole("heading", { level: 4, name: "Is it free?" }),
    ).toBeInTheDocument()
  })

  it("toggles aria-expanded and reveals the answer", async () => {
    const user = userEvent.setup()
    render(<FaqAccordion items={items} />)

    const trigger = screen.getByRole("button", { name: "Is it free?" })
    expect(trigger).toHaveAttribute("aria-expanded", "false")

    await user.click(trigger)
    expect(trigger).toHaveAttribute("aria-expanded", "true")

    const panelId = trigger.getAttribute("aria-controls")
    expect(panelId).toBeTruthy()
    expect(document.getElementById(panelId!)).toHaveTextContent("MIT licensed")
  })

  it("puts data-panel-open on the trigger, which the chevron rotation targets", async () => {
    // Base UI uses `data-open` on the *panel* and `data-panel-open` on the
    // *trigger*. The chevron sits inside the trigger, so it must target the
    // latter — pinned here because a wrong selector fails silently in CSS.
    const user = userEvent.setup()
    render(<FaqAccordion items={items} />)

    const trigger = screen.getByRole("button", { name: "Is it free?" })
    expect(trigger).not.toHaveAttribute("data-panel-open")

    await user.click(trigger)
    expect(trigger).toHaveAttribute("data-panel-open")
    // `className` on an SVG element is an SVGAnimatedString, not a string.
    expect(trigger.querySelector("svg")?.getAttribute("class")).toContain(
      "group-data-[panel-open]:rotate-180",
    )
  })

  it("keeps closed answers in the DOM so find-in-page can reach them", () => {
    render(<FaqAccordion items={items} />)
    // hiddenUntilFound keeps the text present but hidden, rather than unmounted.
    expect(screen.getByText(/Nothing imports from/)).toBeInTheDocument()
  })

  it("opens the questions named in defaultOpen", () => {
    render(<FaqAccordion items={items} defaultOpen={["faq-is-it-free"]} />)
    expect(screen.getByRole("button", { name: "Is it free?" })).toHaveAttribute(
      "aria-expanded",
      "true",
    )
  })

  it("emits FAQPage structured data only when asked", () => {
    const { container, rerender } = render(<FaqAccordion items={items} />)
    expect(container.querySelector('script[type="application/ld+json"]')).toBeNull()

    rerender(<FaqAccordion items={items} schemaOrg />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
    expect(JSON.parse(script!.textContent!)).toMatchObject({
      "@type": "FAQPage",
      mainEntity: [{ name: "Is it free?" }, { name: "Does it need Next.js?" }],
    })
  })
})
