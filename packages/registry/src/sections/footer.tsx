/**
 * Footer — multi-column link groups, brand block, and a legal line.
 *
 * Degrades on purpose: with no `groups` it renders as a single simple row, which
 * is the right footer for a one-page site. Adding groups turns it into the
 * multi-column form without a second component.
 *
 * a11y: several things worth spelling out.
 *
 *  - Each column is a `<nav>` with its own accessible name taken from the column
 *    heading, so a screen reader announces "Product navigation" rather than
 *    meeting four unnamed navigation landmarks in a row.
 *  - Column headings are real headings at a level the caller controls, not
 *    styled `<div>`s.
 *  - Social links carry visible-to-AT names even when they show only an icon.
 *  - The copyright year is rendered by the caller, not by `new Date()`. Deriving
 *    it here would mean the server and the client can disagree across midnight,
 *    and it makes the output non-deterministic for snapshot tests.
 *
 * Dependencies: react, @registry/lib/types, @registry/lib/utils,
 * @registry/ui/container, @registry/ui/heading.
 */

import type { ElementType, ReactNode } from "react"

import type { HeadingLevel, IconComponent, LinkComponent } from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Container } from "@registry/ui/container"
import { Heading } from "@registry/ui/heading"

export interface FooterLink {
  label: string
  href: string
  external?: boolean
  /** Shown as a small tag beside the label — "New", "Beta". */
  badge?: ReactNode
}

export interface FooterGroup {
  title: string
  links: FooterLink[]
}

export interface FooterSocial {
  label: string
  href: string
  icon: IconComponent
}

export interface FooterProps {
  groups?: FooterGroup[]
  /** Wordmark, logo, or a short pitch. */
  brand?: ReactNode
  /** Rendered under the brand — a newsletter form, a status badge. */
  children?: ReactNode
  social?: FooterSocial[]
  /** The full line, e.g. `© 2026 Acme, Inc.` Rendered as given. */
  copyright?: ReactNode
  /** Privacy, terms, and similar. Rendered inline at the bottom. */
  legal?: FooterLink[]
  link?: LinkComponent
  /** Outline level of the column headings. Defaults to `2`. */
  headingLevel?: HeadingLevel
  className?: string
  id?: string
}

const linkClass =
  "text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex min-h-8 items-center gap-2 rounded-sm text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"

export function Footer({
  groups = [],
  brand,
  children,
  social = [],
  copyright,
  legal = [],
  link,
  headingLevel = 2,
  className,
  id,
}: FooterProps) {
  const Link = (link ?? "a") as ElementType

  const renderLink = (item: FooterLink) => (
    <li key={`${item.href}-${item.label}`}>
      <Link
        href={item.href}
        {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={linkClass}
      >
        {item.label}
        {item.badge}
        {item.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </Link>
    </li>
  )

  return (
    <footer id={id} className={cn("border-t", className)}>
      <Container className="flex flex-col gap-12 py-14">
        {groups.length > 0 || brand || children ? (
          <div
            className={cn(
              "grid gap-10",
              groups.length > 0 &&
                "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,3fr)] lg:gap-16",
            )}
          >
            {brand || children ? (
              <div className="flex max-w-sm flex-col gap-4">
                {brand}
                {children}
              </div>
            ) : null}

            {groups.length > 0 ? (
              <div
                className={cn(
                  "grid gap-10 sm:gap-8",
                  groups.length >= 4 ? "sm:grid-cols-2 md:grid-cols-4" : "sm:grid-cols-3",
                )}
              >
                {groups.map((group) => {
                  const groupId = slugId(group.title, "footer")
                  return (
                    // Naming each column stops the footer from contributing a
                    // run of indistinguishable navigation landmarks.
                    <nav
                      key={group.title}
                      aria-labelledby={groupId}
                      className="flex flex-col gap-4"
                    >
                      <Heading
                        level={headingLevel}
                        id={groupId}
                        className="text-foreground text-sm font-semibold"
                      >
                        {group.title}
                      </Heading>
                      <ul className="flex flex-col gap-2.5">
                        {group.links.map(renderLink)}
                      </ul>
                    </nav>
                  )
                })}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="border-border flex flex-col-reverse gap-6 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {copyright ? <p>{copyright}</p> : null}
            {legal.length > 0 ? (
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {legal.map(renderLink)}
              </ul>
            ) : null}
          </div>

          {social.length > 0 ? (
            <ul className="flex items-center gap-1">
              {social.map((item) => {
                const Icon = item.icon as ElementType
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring inline-flex size-11 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2"
                    >
                      <Icon aria-hidden focusable="false" className="size-5" />
                      <span className="sr-only">{item.label} (opens in a new tab)</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
      </Container>
    </footer>
  )
}
