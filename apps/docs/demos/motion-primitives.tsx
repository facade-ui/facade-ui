"use client"

import { FadeIn } from "@registry/motion/fade-in"
import { Reveal } from "@registry/motion/reveal"
import { Stagger, StaggerItem } from "@registry/motion/stagger"

const items = ["Composable", "Accessible", "Themeable", "Framework-neutral"]

export function Demo() {
  return (
    <div className="flex flex-col gap-10">
      <FadeIn className="bg-accent text-accent-foreground rounded-lg px-4 py-3 text-sm font-medium">
        FadeIn — plays on mount
      </FadeIn>

      <Stagger as="ul" trigger="mount" className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <StaggerItem
            key={item}
            as="li"
            className="bg-card rounded-lg border px-4 py-3 text-sm font-medium"
          >
            {item}
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal
        direction="left"
        className="bg-accent text-accent-foreground rounded-lg px-4 py-3 text-sm font-medium"
      >
        Reveal — plays once, when scrolled into view
      </Reveal>
    </div>
  )
}
