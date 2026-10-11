/**
 * Changelog — a release history page, assembled from registry sections.
 *
 * A page header, the releases, and an optional email sign-up for people who
 * want the next one in their inbox. Like the other templates it is
 * composition: `ChangelogList` does the work and installs on its own too.
 *
 * a11y: the page title is the only `<h1>`; each release is an `<h2>` inside
 * its own `<article>`, so heading navigation steps release by release. The
 * sign-up reports its outcome through `Newsletter`'s live region.
 *
 * Dependencies: react, @registry/lib/types, @registry/sections/*,
 * @registry/ui/*.
 */

import type { ReactNode } from "react"

import type { CtaItem, LinkComponent } from "@registry/lib/types"
import {
  ChangelogList,
  type ChangeKind,
  type ChangelogEntry,
} from "@registry/sections/changelog-list"
import { Footer, type FooterGroup, type FooterLink } from "@registry/sections/footer"
import { NavTop, type NavItem } from "@registry/sections/nav-top"
import { Newsletter, type NewsletterStatus } from "@registry/sections/newsletter"
import { Container } from "@registry/ui/container"
import { CtaGroup } from "@registry/ui/cta-group"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"

export interface ChangelogContent {
  brand: ReactNode
  nav: NavItem[]
  navActions?: CtaItem[]

  header: {
    eyebrow?: string
    title: string
    description?: string
    /** Links beside the title, such as an RSS feed or the GitHub releases. */
    actions?: CtaItem[]
  }

  /** Newest first. */
  releases: ChangelogEntry[]
  /** Words for the change kinds, for translation. */
  kindLabels?: Partial<Record<ChangeKind, string>>

  subscribe?: {
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

export interface ChangelogProps {
  content: ChangelogContent
  link?: LinkComponent
  /** Marks the active nav item. */
  currentPath?: string
  /** Shown above the header. Usually a `Banner`. */
  banner?: ReactNode
  /** Wire this to your own form action or mutation. */
  onSubscribe?: (email: string) => void
  subscribeStatus?: NewsletterStatus
  subscribeError?: string
}

export function Changelog({
  content,
  link,
  currentPath,
  banner,
  onSubscribe,
  subscribeStatus,
  subscribeError,
}: ChangelogProps) {
  const { header, releases, subscribe, footer } = content

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
        {/* A div: the h1 names the page, so a second landmark adds nothing. */}
        <Section as="div" spacing="md" className="border-b">
          <Container size="md">
            <SectionHeader
              headingLevel={1}
              size="lg"
              eyebrow={header.eyebrow}
              title={header.title}
              description={header.description}
              actions={
                header.actions ? (
                  <CtaGroup items={header.actions} link={link} size="sm" />
                ) : undefined
              }
            />
          </Container>
        </Section>

        <ChangelogList
          items={releases}
          kindLabels={content.kindLabels}
          link={link}
          itemHeadingLevel={2}
          spacing="sm"
        />

        {subscribe ? (
          <Newsletter
            eyebrow={subscribe.eyebrow}
            title={subscribe.title}
            description={subscribe.description}
            note={subscribe.note}
            onSubmit={onSubscribe}
            status={subscribeStatus}
            errorMessage={subscribeError}
            headingLevel={2}
          />
        ) : null}
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
