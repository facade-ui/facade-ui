import { AccessibilityIcon, BlocksIcon, PaletteIcon, ZapIcon } from "lucide-react"
import Link from "next/link"

import { InstallCommand } from "@/components/install-command"
import { getRegistryItems, installCommands } from "@/lib/registry"
import { buttonVariants } from "@registry/ui/button"
import { Container } from "@registry/ui/container"
import { Eyebrow } from "@registry/ui/eyebrow"
import { FeatureIcon } from "@registry/ui/feature-icon"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"

const PILLARS = [
  {
    icon: BlocksIcon,
    title: "Sections, not snippets",
    body: "Content-driven sections that take typed data and slots. Composition over a hundred props.",
  },
  {
    icon: AccessibilityIcon,
    title: "WCAG 2.2 AA, checked",
    body: "Contrast is verified from the real tokens in CI, and every section is scanned with axe in light and dark.",
  },
  {
    icon: PaletteIcon,
    title: "Inherits your theme",
    body: "shadcn-compatible token names, so a section dropped into an existing project looks like it belongs.",
  },
  {
    icon: ZapIcon,
    title: "Motion, optional",
    body: "Every section ships static first. The motion variant wraps it, and reduced motion is honoured throughout.",
  },
]

export default function HomePage() {
  const itemCount = getRegistryItems().length
  const commands = installCommands("hero-split")

  return (
    <>
      <Section spacing="lg" labelledBy="facade-the-front-of-every-great-website">
        <Container className="flex flex-col items-center gap-8 text-center">
          <Eyebrow tone="primary">Free and open source</Eyebrow>
          <h1
            id="facade-the-front-of-every-great-website"
            className="text-display-lg max-w-3xl text-balance font-semibold"
          >
            The front of every great website
          </h1>
          <p className="text-muted-foreground max-w-2xl text-pretty text-lg sm:text-xl">
            A shadcn-style registry of marketing sections, atoms and a design system.
            Install a piece, and its source lands in your project — yours to read, change
            and own.
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
            description="Code quality, accessibility and composability are the product. There is nothing to buy and nothing gated."
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
            description="React 19 and server components by default. Base UI for every interactive primitive — never Radix, never both."
          />
          <dl className="mx-auto grid max-w-2xl gap-6 text-center sm:grid-cols-4">
            {[
              ["React", "19, RSC-first"],
              ["Base UI", "1.0 rc"],
              ["Tailwind", "v4 tokens"],
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
          <p>MIT licensed. Built in the open.</p>
          <a
            href="https://github.com/facade-ui/facade-ui"
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
