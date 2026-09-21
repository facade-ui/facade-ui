"use client"

/**
 * NavSide — the docs- and product-style side navigation.
 *
 * Groups of links, optionally collapsible, with the current page marked. Below
 * `lg` it collapses into the same Base UI Dialog drawer pattern `NavTop` uses,
 * because a fixed sidebar on a phone is just lost width.
 *
 * a11y:
 *
 *  - One `<nav>` with an accessible name, and group headings inside it. Four
 *    separate `<nav>` landmarks — one per group — is the more common shape and
 *    the worse one: landmark navigation then lists four items called
 *    "navigation" with nothing to tell them apart.
 *  - Groups are real headings, so heading navigation works down the sidebar.
 *  - Collapsible groups use Base UI's Collapsible, so the trigger is a button
 *    inside the heading with `aria-expanded` and `aria-controls` wired up.
 *  - The current page carries `aria-current="page"`, announced rather than only
 *    coloured. Its ancestor group is expanded on first render, so the active
 *    item is never hidden inside a collapsed section.
 *  - The sidebar scrolls independently and the drawer traps focus.
 *
 * Dependencies: @base-ui-components/react, lucide-react, react,
 * @registry/lib/types, @registry/lib/utils, @registry/ui/button,
 * @registry/ui/heading.
 */

import { Collapsible } from "@base-ui-components/react/collapsible"
import { Dialog } from "@base-ui-components/react/dialog"
import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react"
import { useState, type ElementType, type ReactNode } from "react"

import type { HeadingLevel, LinkComponent } from "@registry/lib/types"
import { cn, slugId } from "@registry/lib/utils"
import { buttonVariants } from "@registry/ui/button"
import { Heading } from "@registry/ui/heading"

export interface NavSideLink {
  label: string
  href: string
  /** Small trailing tag — "New", "Beta". */
  badge?: ReactNode
  external?: boolean
}

export interface NavSideGroup {
  title: string
  links: NavSideLink[]
  /** Makes the group a Base UI Collapsible. */
  collapsible?: boolean
  /** Start collapsed. Ignored when the group holds the current page. */
  defaultCollapsed?: boolean
}

export interface NavSideProps {
  groups: NavSideGroup[]
  /** Names the landmark, e.g. "Documentation". */
  label?: string
  currentPath?: string
  link?: LinkComponent
  /** Outline level of the group headings. Defaults to `2`. */
  headingLevel?: HeadingLevel
  /** Rendered above the groups — a version switcher, a search trigger. */
  children?: ReactNode
  /** Offset for the sticky sidebar, to clear a fixed header. */
  stickyTop?: string
  className?: string
  id?: string
}

const linkClass =
  "focus-visible:ring-ring flex min-h-9 items-center justify-between gap-2 rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"

function NavLinks({
  group,
  currentPath,
  link,
  onNavigate,
}: {
  group: NavSideGroup
  currentPath?: string
  link?: LinkComponent
  onNavigate?: () => void
}) {
  const Link = (link ?? "a") as ElementType

  return (
    <ul className="flex flex-col gap-0.5">
      {group.links.map((item) => {
        const active = currentPath === item.href
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={cn(
                linkClass,
                active
                  ? "bg-secondary text-secondary-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
              )}
            >
              <span>{item.label}</span>
              {item.badge}
              {item.external ? (
                <span className="sr-only"> (opens in a new tab)</span>
              ) : null}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

function NavGroups({
  groups,
  currentPath,
  link,
  headingLevel,
  onNavigate,
}: {
  groups: NavSideGroup[]
  currentPath?: string
  link?: LinkComponent
  headingLevel: HeadingLevel
  onNavigate?: () => void
}) {
  return (
    <div className="flex flex-col gap-7">
      {groups.map((group) => {
        const holdsCurrent = group.links.some((item) => item.href === currentPath)
        const headingId = slugId(group.title, "nav")

        if (!group.collapsible) {
          return (
            <div key={group.title} className="flex flex-col gap-1.5">
              <Heading
                level={headingLevel}
                id={headingId}
                className="text-foreground px-3 text-sm font-semibold"
              >
                {group.title}
              </Heading>
              <NavLinks
                group={group}
                currentPath={currentPath}
                link={link}
                onNavigate={onNavigate}
              />
            </div>
          )
        }

        return (
          <Collapsible.Root
            key={group.title}
            // Never start collapsed around the page the user is on.
            defaultOpen={holdsCurrent || !group.defaultCollapsed}
            className="flex flex-col gap-1.5"
          >
            <Heading level={headingLevel} id={headingId}>
              <Collapsible.Trigger className="text-foreground hover:bg-accent/60 focus-visible:ring-ring group flex min-h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2">
                {group.title}
                <ChevronDownIcon
                  aria-hidden
                  focusable="false"
                  className="text-muted-foreground duration-facade-fast ease-facade-out size-4 transition-transform group-data-[panel-open]:rotate-180"
                />
              </Collapsible.Trigger>
            </Heading>
            <Collapsible.Panel className="duration-facade-base ease-facade-out h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] data-[ending-style]:h-0 data-[starting-style]:h-0">
              <NavLinks
                group={group}
                currentPath={currentPath}
                link={link}
                onNavigate={onNavigate}
              />
            </Collapsible.Panel>
          </Collapsible.Root>
        )
      })}
    </div>
  )
}

export function NavSide({
  groups,
  label = "Section",
  currentPath,
  link,
  headingLevel = 2,
  children,
  stickyTop = "5rem",
  className,
  id,
}: NavSideProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <nav id={id} aria-label={label} className={cn("hidden lg:block", className)}>
        <div
          className="sticky overflow-y-auto pb-10 pr-4"
          style={{ top: stickyTop, maxHeight: `calc(100dvh - ${stickyTop} - 1rem)` }}
        >
          {children ? <div className="mb-6">{children}</div> : null}
          <NavGroups
            groups={groups}
            currentPath={currentPath}
            link={link}
            headingLevel={headingLevel}
          />
        </div>
      </nav>

      <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Dialog.Trigger
          aria-label={`Open ${label.toLowerCase()} navigation`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "lg:hidden")}
        >
          <MenuIcon aria-hidden focusable="false" className="size-4" />
          {label}
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Backdrop className="duration-facade-base fixed inset-0 z-50 bg-black/50 transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <Dialog.Popup className="bg-background duration-facade-base ease-facade-out fixed inset-y-0 left-0 z-50 flex w-[min(20rem,85vw)] flex-col gap-6 overflow-y-auto border-r p-6 transition-transform data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full">
            <div className="flex items-center justify-between gap-4">
              <Dialog.Title className="text-base font-semibold">{label}</Dialog.Title>
              <Dialog.Close
                aria-label="Close navigation"
                className={buttonVariants({ variant: "ghost", size: "icon" })}
              >
                <XIcon aria-hidden focusable="false" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Browse the pages in this section.
            </Dialog.Description>

            {children}

            <nav aria-label={label}>
              <NavGroups
                groups={groups}
                currentPath={currentPath}
                link={link}
                headingLevel={headingLevel}
                onNavigate={() => setDrawerOpen(false)}
              />
            </nav>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
