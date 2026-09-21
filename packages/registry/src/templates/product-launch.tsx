/**
 * ProductLaunch — a single-product launch page.
 *
 * The narrowest of the three templates, and deliberately so: a launch page has
 * one job. A dismissible banner, a centred hero, the bento grid that shows the
 * thing off, a short USP strip, tabbed detail for people who want it, an FAQ,
 * and one email capture. No pricing table, no team — both dilute a launch.
 *
 * a11y: the banner is a named landmark rather than a live region, because a
 * banner present on load is not an update and announcing it interrupts. The
 * newsletter reports its own outcome through a live region that exists from the
 * first paint.
 *
 * Dependencies: react, @registry/lib/types, @registry/sections/*.
 */

import type { ReactNode } from "react"

import type { CtaItem, LinkComponent } from "@registry/lib/types"
import { Banner } from "@registry/sections/banner"
import { BentoGrid, type BentoItem } from "@registry/sections/bento-grid"
import { FaqAccordion, type FaqItem } from "@registry/sections/faq-accordion"
import { FeatureTabs, type FeatureTabItem } from "@registry/sections/feature-tabs"
import { Footer, type FooterGroup, type FooterLink } from "@registry/sections/footer"
import { HeroCentered } from "@registry/sections/hero-centered"
import { NavTop, type NavItem } from "@registry/sections/nav-top"
import { Newsletter, type NewsletterStatus } from "@registry/sections/newsletter"
import { UspList, type UspItem } from "@registry/sections/usp-list"

export interface ProductLaunchContent {
  brand: ReactNode
  nav: NavItem[]
  navActions?: CtaItem[]

  announcement?: {
    /** Names the landmark. */
    label?: string
    message: ReactNode
    action?: { label: string; href: string; external?: boolean }
    /** Remembers the dismissal across visits. */
    storageKey?: string
  }

  hero: {
    eyebrow?: string
    title: string
    description: string
    actions: CtaItem[]
    note?: ReactNode
    banner?: ReactNode
    media?: ReactNode
  }

  highlights: {
    eyebrow?: string
    title: string
    description?: string
    items: BentoItem[]
  }

  usps?: { title?: string; eyebrow?: string; items: UspItem[] }

  detail?: {
    eyebrow?: string
    title: string
    description?: string
    items: FeatureTabItem[]
  }

  faq?: {
    eyebrow?: string
    title: string
    items: FaqItem[]
  }

  signup: {
    eyebrow?: string
    title: string
    description?: string
    note?: ReactNode
  }

  footer: {
    groups?: FooterGroup[]
    brand?: ReactNode
    copyright?: ReactNode
    legal?: FooterLink[]
  }
}

export interface ProductLaunchProps {
  content: ProductLaunchContent
  /**
   * No `image` prop, unlike the other two templates: every visual in this page
   * comes through a `media` ReactNode slot, so there is no data-driven image
   * list for a component type to be threaded into. Pass `<Image />` directly.
   */
  link?: LinkComponent
  currentPath?: string
  /** Wire this to your own form action or mutation. */
  onSignUp?: (email: string) => void
  signUpStatus?: NewsletterStatus
  signUpError?: string
}

export function ProductLaunch({
  content,
  link,
  currentPath,
  onSignUp,
  signUpStatus,
  signUpError,
}: ProductLaunchProps) {
  const { announcement, hero, highlights, usps, detail, faq, signup, footer } = content

  return (
    <>
      {announcement ? (
        <Banner
          label={announcement.label ?? "Announcement"}
          action={announcement.action}
          storageKey={announcement.storageKey}
          link={link}
          dismissible
        >
          {announcement.message}
        </Banner>
      ) : null}

      <NavTop
        brand={content.brand}
        items={content.nav}
        actions={content.navActions}
        link={link}
        currentPath={currentPath}
      />

      <main id="main">
        <HeroCentered
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          actions={hero.actions}
          note={hero.note}
          banner={hero.banner}
          media={hero.media}
          link={link}
          headingLevel={1}
          size="xl"
          spacing="lg"
        />

        <BentoGrid
          eyebrow={highlights.eyebrow}
          title={highlights.title}
          description={highlights.description}
          items={highlights.items}
          link={link}
          headingLevel={2}
          itemHeadingLevel={3}
          align="center"
        />

        {usps ? (
          <UspList
            eyebrow={usps.eyebrow}
            title={usps.title}
            items={usps.items}
            headingLevel={2}
            itemHeadingLevel={3}
            align="center"
            className="border-y"
          />
        ) : null}

        {detail ? (
          <FeatureTabs
            eyebrow={detail.eyebrow}
            title={detail.title}
            description={detail.description}
            items={detail.items}
            headingLevel={2}
            itemHeadingLevel={3}
          />
        ) : null}

        {faq ? (
          <FaqAccordion
            eyebrow={faq.eyebrow}
            title={faq.title}
            items={faq.items}
            headingLevel={2}
            itemHeadingLevel={3}
            align="center"
            schemaOrg
          />
        ) : null}

        <Newsletter
          eyebrow={signup.eyebrow}
          title={signup.title}
          description={signup.description}
          note={signup.note}
          onSubmit={onSignUp}
          status={signUpStatus}
          errorMessage={signUpError}
          headingLevel={2}
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
