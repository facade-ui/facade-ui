/**
 * Agency — a studio or agency site, assembled from registry sections.
 *
 * Differs from `SaasLanding` in shape rather than in parts: a centred hero over
 * media, work as a card grid, a process as numbered steps, the people, and one
 * featured quote instead of a wall of them. Agencies sell judgement and people,
 * so the page leads with work and faces rather than with features and pricing.
 *
 * a11y: the same explicit outline discipline — the hero is the page's `<h1>`,
 * every band an `<h2>`, every item an `<h3>`. The hero uses the `overlay`
 * placement, which always paints a scrim, because text over an arbitrary image
 * has no guaranteed contrast ratio.
 *
 * Dependencies: react, @registry/lib/types, @registry/sections/*.
 */

import type { ReactNode } from "react"

import type { CtaItem, ImageComponent, LinkComponent } from "@registry/lib/types"
import { CardList, type CardItem } from "@registry/sections/card-list"
import { CtaBand } from "@registry/sections/cta-band"
import { Footer, type FooterGroup, type FooterLink } from "@registry/sections/footer"
import { HeroWithMedia } from "@registry/sections/hero-with-media"
import { LogoCloud } from "@registry/sections/logo-cloud"
import { NavTop, type NavItem } from "@registry/sections/nav-top"
import { Stats } from "@registry/sections/stats"
import { Steps, type StepItem } from "@registry/sections/steps"
import { Team, type TeamMember } from "@registry/sections/team"
import { TestimonialSingle } from "@registry/sections/testimonial-single"
import type { LogoItem } from "@registry/ui/logo-mark"
import type { StatItem } from "@registry/ui/stat"
import type { TestimonialItem } from "@registry/ui/testimonial"

export interface AgencyContent {
  brand: ReactNode
  nav: NavItem[]
  navActions?: CtaItem[]

  hero: {
    eyebrow?: string
    title: string
    description: string
    actions: CtaItem[]
    /** Decorative in overlay placement: give it `alt=""`. */
    media: ReactNode
  }

  clients?: { title?: string; items: LogoItem[] }

  work: {
    eyebrow?: string
    title: string
    description?: string
    items: CardItem[]
  }

  process?: {
    eyebrow?: string
    title: string
    description?: string
    items: StepItem[]
  }

  stats?: { title?: string; eyebrow?: string; items: StatItem[] }

  quote?: { title?: string; item: TestimonialItem }

  team?: {
    eyebrow?: string
    title: string
    description?: string
    items: TeamMember[]
  }

  cta: {
    eyebrow?: string
    title: string
    description?: string
    actions: CtaItem[]
  }

  footer: {
    groups?: FooterGroup[]
    brand?: ReactNode
    copyright?: ReactNode
    legal?: FooterLink[]
  }
}

export interface AgencyProps {
  content: AgencyContent
  image?: ImageComponent
  link?: LinkComponent
  currentPath?: string
  banner?: ReactNode
}

export function Agency({ content, image, link, currentPath, banner }: AgencyProps) {
  const { hero, clients, work, process, stats, quote, team, cta, footer } = content

  return (
    <>
      {banner}

      <NavTop
        brand={content.brand}
        items={content.nav}
        actions={content.navActions}
        link={link}
        currentPath={currentPath}
      />

      <main id="main">
        <HeroWithMedia
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          actions={hero.actions}
          media={hero.media}
          link={link}
          placement="overlay"
          size="xl"
          headingLevel={1}
          spacing="lg"
        />

        {clients ? (
          <LogoCloud
            title={clients.title}
            items={clients.items}
            image={image}
            link={link}
            headingLevel={2}
            spacing="sm"
          />
        ) : null}

        <CardList
          eyebrow={work.eyebrow}
          title={work.title}
          description={work.description}
          items={work.items}
          image={image}
          link={link}
          headingLevel={2}
          itemHeadingLevel={3}
          columns={3}
        />

        {process ? (
          <Steps
            eyebrow={process.eyebrow}
            title={process.title}
            description={process.description}
            items={process.items}
            headingLevel={2}
            itemHeadingLevel={3}
          />
        ) : null}

        {quote ? (
          <TestimonialSingle
            title={quote.title ?? "Client story"}
            item={quote.item}
            image={image}
            variant="muted"
          />
        ) : null}

        {stats ? (
          <Stats
            eyebrow={stats.eyebrow}
            title={stats.title}
            items={stats.items}
            headingLevel={2}
            variant="divided"
            className="border-y"
          />
        ) : null}

        {team ? (
          <Team
            eyebrow={team.eyebrow}
            title={team.title}
            description={team.description}
            items={team.items}
            image={image}
            link={link}
            headingLevel={2}
            itemHeadingLevel={3}
            shape="circle"
          />
        ) : null}

        <CtaBand
          eyebrow={cta.eyebrow}
          title={cta.title}
          description={cta.description}
          actions={cta.actions}
          link={link}
          headingLevel={2}
          layout="split"
          variant="card"
        />
      </main>

      <Footer
        brand={footer.brand ?? content.brand}
        groups={footer.groups}
        copyright={footer.copyright}
        legal={footer.legal}
        link={link}
        headingLevel={2}
      />
    </>
  )
}
