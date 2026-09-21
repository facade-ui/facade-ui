/**
 * SaasLanding — a complete SaaS marketing page, assembled from registry sections.
 *
 * A template is composition, not a new component: every section below is the
 * same one you can install on its own, given content. That is the point — the
 * template shows how the pieces sit together and is meant to be edited, not
 * configured.
 *
 * Everything is content-driven through one `SaasLandingContent` object, so the
 * page can be rendered from a CMS payload without touching this file. Pass
 * `image` and `link` once and they reach every section that needs them.
 *
 * a11y: the heading outline is the template's job, and it is explicit here
 * rather than left to each section's default. The hero is the page's `<h1>`;
 * every other band is an `<h2>` with its own items at `<h3>`. Because the
 * sections take `headingLevel` as a prop, that holds no matter how the page is
 * rearranged.
 *
 * `<main>` is rendered here, and `NavTop`'s `<header>` and `Footer`'s
 * `<footer>` sit outside it, so the landmark structure is correct for the whole
 * document rather than for a fragment of it.
 *
 * Dependencies: react, @registry/lib/types, @registry/sections/*.
 */

import type { ReactNode } from "react"

import type { CtaItem, ImageComponent, LinkComponent } from "@registry/lib/types"
import { CtaBand } from "@registry/sections/cta-band"
import { FaqAccordion, type FaqItem } from "@registry/sections/faq-accordion"
import { FeatureGrid, type FeatureItem } from "@registry/sections/feature-grid"
import { FeatureRows, type FeatureRowItem } from "@registry/sections/feature-rows"
import { Footer, type FooterGroup, type FooterLink } from "@registry/sections/footer"
import { HeroSplit } from "@registry/sections/hero-split"
import { LogoCloud } from "@registry/sections/logo-cloud"
import { NavTop, type NavItem } from "@registry/sections/nav-top"
import { PricingTiers } from "@registry/sections/pricing-tiers"
import { Stats } from "@registry/sections/stats"
import { TestimonialsGrid } from "@registry/sections/testimonials-grid"
import type { LogoItem } from "@registry/ui/logo-mark"
import type { PricingTierItem } from "@registry/ui/pricing-tier"
import type { StatItem } from "@registry/ui/stat"
import type { TestimonialItem } from "@registry/ui/testimonial"

export interface SaasLandingContent {
  brand: ReactNode
  nav: NavItem[]
  navActions?: CtaItem[]

  hero: {
    eyebrow?: string
    title: string
    description: string
    actions: CtaItem[]
    note?: ReactNode
    media?: ReactNode
  }

  logos?: { title?: string; items: LogoItem[] }
  stats?: { title?: string; eyebrow?: string; items: StatItem[] }

  features: {
    eyebrow?: string
    title: string
    description?: string
    items: FeatureItem[]
  }

  rows?: {
    eyebrow?: string
    title?: string
    description?: string
    items: FeatureRowItem[]
  }

  testimonials?: {
    eyebrow?: string
    title: string
    description?: string
    items: TestimonialItem[]
  }

  pricing?: {
    eyebrow?: string
    title: string
    description?: string
    items: PricingTierItem[]
    note?: ReactNode
  }

  faq?: {
    eyebrow?: string
    title: string
    description?: string
    items: FaqItem[]
  }

  cta: {
    eyebrow?: string
    title: string
    description?: string
    actions: CtaItem[]
    note?: ReactNode
  }

  footer: {
    groups?: FooterGroup[]
    brand?: ReactNode
    copyright?: ReactNode
    legal?: FooterLink[]
  }
}

export interface SaasLandingProps {
  content: SaasLandingContent
  image?: ImageComponent
  link?: LinkComponent
  /** Marks the active nav item. */
  currentPath?: string
  /** Rendered above the header — a `Banner`, usually. */
  banner?: ReactNode
}

export function SaasLanding({
  content,
  image,
  link,
  currentPath,
  banner,
}: SaasLandingProps) {
  const { hero, logos, stats, features, rows, testimonials, pricing, faq, cta, footer } =
    content

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
        {/* The only h1 on the page. */}
        <HeroSplit
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          actions={hero.actions}
          note={hero.note}
          media={hero.media}
          link={link}
          headingLevel={1}
          spacing="lg"
        />

        {logos ? (
          <LogoCloud
            title={logos.title}
            items={logos.items}
            image={image}
            link={link}
            headingLevel={2}
            spacing="sm"
          />
        ) : null}

        <FeatureGrid
          eyebrow={features.eyebrow}
          title={features.title}
          description={features.description}
          items={features.items}
          link={link}
          headingLevel={2}
          itemHeadingLevel={3}
          align="center"
        />

        {rows ? (
          <FeatureRows
            eyebrow={rows.eyebrow}
            title={rows.title}
            description={rows.description}
            items={rows.items}
            link={link}
            headingLevel={2}
            itemHeadingLevel={3}
            align="center"
          />
        ) : null}

        {stats ? (
          <Stats
            eyebrow={stats.eyebrow}
            title={stats.title}
            items={stats.items}
            headingLevel={2}
            className="border-y"
          />
        ) : null}

        {testimonials ? (
          <TestimonialsGrid
            eyebrow={testimonials.eyebrow}
            title={testimonials.title}
            description={testimonials.description}
            items={testimonials.items}
            image={image}
            headingLevel={2}
          />
        ) : null}

        {pricing ? (
          <PricingTiers
            eyebrow={pricing.eyebrow}
            title={pricing.title}
            description={pricing.description}
            items={pricing.items}
            note={pricing.note}
            link={link}
            headingLevel={2}
            tierHeadingLevel={3}
          />
        ) : null}

        {faq ? (
          <FaqAccordion
            eyebrow={faq.eyebrow}
            title={faq.title}
            description={faq.description}
            items={faq.items}
            headingLevel={2}
            itemHeadingLevel={3}
            align="center"
            schemaOrg
          />
        ) : null}

        <CtaBand
          eyebrow={cta.eyebrow}
          title={cta.title}
          description={cta.description}
          actions={cta.actions}
          note={cta.note}
          link={link}
          headingLevel={2}
          variant="primary"
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
