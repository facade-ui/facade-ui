import { AccessibilityIcon, BlocksIcon, PaletteIcon, ZapIcon } from "lucide-react"
import Link from "next/link"

import { InstallCommand } from "@/components/install-command"
import { getRegistryItems, installCommands } from "@/lib/registry"
import { GITHUB_URL } from "@/lib/registry-shared"
import { buttonVariants } from "@registry/ui/button"
import { Container } from "@registry/ui/container"
import { Eyebrow } from "@registry/ui/eyebrow"
import { FeatureIcon } from "@registry/ui/feature-icon"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"

const PILLARS = [
  {
    icon: BlocksIcon,
    title: "Complete sections",
    body: "Each section is a full part of a page, such as a hero or a pricing table. You pass in your content as typed data.",
  },
  {
    icon: AccessibilityIcon,
    title: "Accessibility is tested",
    body: "Every section is tested against WCAG 2.2 AA. Colour contrast is checked on every change, and each section is scanned with axe in light and dark mode.",
  },
  {
    icon: PaletteIcon,
    title: "Uses your theme",
    body: "Sections use the same colour names as shadcn/ui. If your project already has a shadcn theme, the sections use it without changes.",
  },
  {
    icon: ZapIcon,
    title: "Animation is optional",
    body: "Every section works without animation. To add it, install the motion version. It follows the reduced-motion setting on the reader's device.",
  },
]

export default function HomePage() {
  const itemCount = getRegistryItems().length
  const commands = installCommands("hero-split")

  return (
    <>
      <Section spacing="lg" labelledBy="facade-the-front-of-every-great-website">
        <Container className="flex flex-col items-center gap-8 text-center">
          <Eyebrow tone="primary">For marketing websites</Eyebrow>
          <h1
            id="facade-the-front-of-every-great-website"
            className="text-display-lg max-w-3xl text-balance font-semibold"
          >
            The front of every great website
          </h1>
          <p className="text-muted-foreground max-w-2xl text-pretty text-lg sm:text-xl">
            Facade UI gives you the sections a marketing website needs: heroes, feature
            grids, pricing tables, FAQs and footers, plus full page templates. You install
            each one with the shadcn CLI, which copies its source code into your project.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/docs/installation" className={buttonVariants({ size: "lg" })}>
              Get started
            </Link>
            <Link
              href="/components"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Browse {itemCount} components
            </Link>
          </div>
          <InstallCommand commands={commands} className="w-full max-w-xl text-left" />
        </Container>
      </Section>

      <Section labelledBy="facade-what-you-get" className="border-t">
        <Container className="flex flex-col gap-12">
          <SectionHeader
            align="center"
            eyebrow="Why"
            title="What you get"
            description="Everything is free and open source. There is no paid version."
          />
          <ul className="grid gap-8 sm:grid-cols-2">
            {PILLARS.map((pillar) => (
              <li key={pillar.title} className="flex gap-4">
                <FeatureIcon icon={pillar.icon} />
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">{pillar.title}</h3>
                  <p className="text-muted-foreground text-pretty text-sm">
                    {pillar.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section labelledBy="facade-built-on" className="border-t">
        <Container className="flex flex-col gap-8">
          <SectionHeader
            align="center"
            eyebrow="Stack"
            title="Built on"
            description="Sections are React 19 server components by default. Interactive parts, such as menus and accordions, use Base UI."
          />
          <dl className="mx-auto grid max-w-2xl gap-6 text-center sm:grid-cols-4">
            {[
              ["React", "19, server components"],
              ["Base UI", "1.0 release candidate"],
              ["Tailwind", "v4"],
              ["Motion", "optional"],
            ].map(([term, detail]) => (
              <div key={term} className="flex flex-col-reverse gap-1">
                <dt className="text-muted-foreground text-sm">{detail}</dt>
                <dd className="text-foreground text-lg font-semibold">{term}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      <footer className="border-t py-10">
        <Container className="text-muted-foreground flex flex-wrap items-center justify-between gap-4 text-sm">
          <p>MIT licensed. Developed in the open.</p>
          <a
            href="/llms.txt"
            className="hover:text-foreground focus-visible:ring-ring rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2"
          >
            llms.txt
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground focus-visible:ring-ring rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2"
          >
            GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Container>
      </footer>
    </>
  )
}
