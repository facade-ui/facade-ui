/** Reading order and abbreviation handling are the whole point of this atom. */

import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Stat } from "./stat"

describe("Stat", () => {
  it("puts the label before the value in the DOM", () => {
    const { container } = render(
      <dl>
        <Stat value="99.9%" label="Uptime" />
      </dl>,
    )
    const group = container.querySelector("dl > div")!
    expect([...group.children].map((child) => child.tagName)).toEqual(["DT", "DD"])
  })

  it("exposes a spoken form for abbreviated values", () => {
    render(
      <dl>
        <Stat value="1.2K" srValue="1200" label="Customers" />
      </dl>,
    )
    expect(screen.getByText("1.2K")).toHaveAttribute("aria-hidden", "true")
    expect(screen.getByText("1200")).toHaveClass("sr-only")
  })
})
