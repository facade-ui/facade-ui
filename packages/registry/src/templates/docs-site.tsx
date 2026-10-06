/**
 * DocsSite — a documentation page, assembled from registry sections.
 *
 * Top navigation, the side navigation, the article and an "On this page"
 * list, with previous and next links at the end. The article body is the
 * `children` slot, styled by `Prose`, so rendered markdown drops straight in.
 *
 * a11y:
 *
 *  - Three named `<nav>` landmarks: the sidebar, "On this page" and "Pages"
 *    for previous and next. Below `xl` the "On this page" list is hidden; the
 *    headings it points to are still in the article.
 *  - The page title is the only `<h1>`. The sidebar's group headings are
 *    `<h2>` and come before it in the source, as on most docs sites; that keeps
 *    heading navigation down the sidebar, so do not demote them.
 *  - Previous and next links carry `rel` and a visible "Previous" or "Next",
 *    so their purpose does not depend on position.
 *
 * Not a client component: it renders client sections but passes them only
 * data, a link component and `children`.
 *
 * Dependencies: react, @registry/lib/types, @registry/lib/utils,
 * @registry/sections/*, @registry/ui/*.
 */

import type { ElementType, ReactNode } from "react"

import type { CtaItem, LinkComponent } from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { Footer, type FooterGroup, type FooterLink } from "@registry/sections/footer"
import { NavSide, type NavSideGroup } from "@registry/sections/nav-side"
import { NavTop, type NavItem } from "@registry/sections/nav-top"
import { Container } from "@registry/ui/container"
import { Eyebrow } from "@registry/ui/eyebrow"
import { Heading } from "@registry/ui/heading"
import { Prose } from "@registry/ui/prose"

export interface TocItem {
  label: string
  /** Usually `#` and the id of a heading in the article. */
  href: string
  children?: TocItem[]
}

export interface DocsPageLink {
  label: string
  href: string
}

export interface DocsSiteContent {
  brand: ReactNode
  nav: NavItem[]
  navActions?: CtaItem[]

  sidebar: {
    /** Names the sidebar landmark. Defaults to "Documentation". */
    label?: string
    groups: NavSideGroup[]
  }

  page: {
    eyebrow?: string
    title: string
    description?: string
    lastUpdated?: { dateTime: string; label: string }
  }

  /** The headings of this page. */
  toc?: { label?: string; items: TocItem[] }

  pagination?: { prev?: DocsPageLink; next?: DocsPageLink }

  footer: {
    groups?: FooterGroup[]
    brand?: ReactNode
    copyright?: ReactNode
    legal?: FooterLink[]
  }
}

export interface DocsSiteProps {
  content: DocsSiteContent
  /** The article body. Rendered markdown or JSX; `Prose` styles it. */
  children: ReactNode
  link?: LinkComponent
  /** Marks the current page in both navigations. */
  currentPath?: string
  /** Shown above the header. Usually a `Banner`. */
  banner?: ReactNode
}

const linkFocus =
  "focus-visible:ring-ring rounded-sm focus-visible:outline-none focus-visible:ring-2"

const pageLink =
  "hover:border-ring flex min-h-11 flex-col gap-1 border p-4 transition-colors"

function TocList({ items, Link }: { items: TocItem[]; Link: ElementType }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item.href} className="flex flex-col gap-2">
          <Link
            href={item.href}
            className={cn(
              "text-muted-foreground hover:text-foreground transition-colors",
              linkFocus,
            )}
          >
            {item.label}
          </Link>
          {item.children?.length ? (
            <div className="border-border border-l pl-3">
              <TocList items={item.children} Link={Link} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

export function DocsSite({
  content,
  children,
  link,
  currentPath,
  banner,
}: DocsSiteProps) {
  const { sidebar, page, toc, pagination, footer } = content
  const Link = (link ?? "a") as ElementType
  const titleId = slugId(page.title, "page")
  const tocId = "docs-site-toc-title"
  const { prev, next } = pagination ?? {}

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

      <Container className="grid gap-10 py-10 lg:grid-cols-[16rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)_13rem]">
        <NavSide
          label={sidebar.label ?? "Documentation"}
          groups={sidebar.groups}
          currentPath={currentPath}
          link={link}
          headingLevel={2}
        />

        <main id="main" className="min-w-0">
          <article aria-labelledby={titleId} className="flex max-w-3xl flex-col gap-10">
            <header className="flex flex-col gap-3">
              {page.eyebrow ? <Eyebrow tone="primary">{page.eyebrow}</Eyebrow> : null}
              <Heading
                level={1}
                id={titleId}
                className="text-display-sm text-balance font-semibold"
              >
                {page.title}
              </Heading>
              {page.description ? (
                <p className="text-muted-foreground text-pretty text-lg">
                  {page.description}
                </p>
              ) : null}
              {page.lastUpdated ? (
                <p className="text-muted-foreground text-sm">
                  Last updated{" "}
                  <time dateTime={page.lastUpdated.dateTime}>
                    {page.lastUpdated.label}
                  </time>
                </p>
              ) : null}
            </header>

            <Prose>{children}</Prose>

            {prev || next ? (
              <nav
                aria-label="Pages"
                className="border-border grid gap-4 border-t pt-8 sm:grid-cols-2"
              >
                {prev ? (
                  <Link
                    href={prev.href}
                    rel="prev"
                    className={cn(pageLink, linkFocus, "rounded-lg")}
                  >
                    <span className="text-muted-foreground text-sm">Previous</span>
                    <span className="font-medium">{prev.label}</span>
                  </Link>
                ) : null}
                {next ? (
                  <Link
                    href={next.href}
                    rel="next"
                    className={cn(
                      pageLink,
                      linkFocus,
                      "rounded-lg text-right sm:col-start-2",
                    )}
                  >
                    <span className="text-muted-foreground text-sm">Next</span>
                    <span className="font-medium">{next.label}</span>
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </article>
        </main>

        {toc?.items.length ? (
          <nav aria-labelledby={tocId} className="hidden xl:block">
            <div className="sticky top-24 flex max-h-[calc(100dvh-7rem)] flex-col gap-3 overflow-y-auto text-sm">
              <Heading level={2} id={tocId} className="text-foreground font-semibold">
                {toc.label ?? "On this page"}
              </Heading>
              <TocList items={toc.items} Link={Link} />
            </div>
          </nav>
        ) : null}
      </Container>

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
