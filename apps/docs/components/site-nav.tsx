"use client"

/**
 * The docs sidebar.
 *
 * Groups are Base UI Collapsibles, closed by default so the whole catalogue —
 * sixty-two items — does not arrive as one unscrollable wall. "Getting started"
 * opens on load, and so does whichever group holds the current page: landing on
 * a component from a link or a search result and finding the sidebar unable to
 * tell you where you are would be worse than the wall.
 *
 * a11y: a `<nav>` with an accessible name, and the current page marked with
 * `aria-current="page"` so it is announced, not merely highlighted. Group
 * headings are real `<h2>`s containing the disclosure button, so the sidebar can
 * be navigated by heading and each group's expanded state is announced. On small
 * screens it collapses into a Base UI Dialog — a real modal with the focus trap,
 * Escape handling, scroll lock and focus restoration a drawer needs.
 */

import { Collapsible } from "@base-ui-components/react/collapsible"
import { Dialog } from "@base-ui-components/react/dialog"
import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"

import type { NavGroup } from "@/lib/registry"
import { buttonVariants } from "@registry/ui/button"
import { cn } from "@registry/lib/utils"

const GUIDE_LINKS = [
  { href: "/docs/installation", label: "Installation" },
  { href: "/docs/theming", label: "Theming" },
  { href: "/docs/customise", label: "Theme customiser" },
  { href: "/docs/accessibility", label: "Accessibility" },
] as const

export interface SiteNavProps {
  groups: NavGroup[]
}

interface NavGroupLink {
  key: string
  href: Route
  label: string
}

function NavGroupSection({
  title,
  links,
  pathname,
  startOpen,
  onNavigate,
}: {
  title: string
  links: NavGroupLink[]
  pathname: string
  startOpen: boolean
  onNavigate?: () => void
}) {
  // `defaultOpen` is read once, on mount. That is the behaviour we want: the
  // group holding the page you arrived on opens, and nothing snaps shut or
  // springs open underneath you as you navigate.
  const holdsCurrentPage = links.some((link) => link.href === pathname)

  return (
    <Collapsible.Root
      defaultOpen={startOpen || holdsCurrentPage}
      className="flex flex-col"
    >
      <h2>
        <Collapsible.Trigger className="text-foreground hover:bg-accent/60 focus-visible:ring-ring group flex min-h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2">
          {title}
          <ChevronDownIcon
            aria-hidden
            focusable="false"
            className="text-muted-foreground duration-facade-fast ease-facade-out size-4 transition-transform group-data-[panel-open]:rotate-180"
          />
        </Collapsible.Trigger>
      </h2>

      <Collapsible.Panel className="duration-facade-base ease-facade-out h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] data-[ending-style]:h-0 data-[starting-style]:h-0">
        <div className="flex flex-col gap-0.5 pt-1">
          {links.map((link) => (
            <NavLink
              key={link.key}
              href={link.href}
              label={link.label}
              active={pathname === link.href}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </Collapsible.Panel>
    </Collapsible.Root>
  )
}

function NavList({ groups, onNavigate }: SiteNavProps & { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-2">
      <NavGroupSection
        title="Getting started"
        startOpen
        pathname={pathname}
        onNavigate={onNavigate}
        links={GUIDE_LINKS.map((link) => ({
          key: link.href,
          href: link.href,
          label: link.label,
        }))}
      />

      {groups.map((group) => (
        <NavGroupSection
          key={group.title}
          title={group.title}
          startOpen={false}
          pathname={pathname}
          onNavigate={onNavigate}
          links={group.items.map((item) => ({
            key: item.name,
            href: item.href,
            label: item.title,
          }))}
        />
      ))}
    </div>
  )
}

function NavLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: Route
  label: string
  active: boolean
  onNavigate?: () => void
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "focus-visible:ring-ring rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2",
        active
          ? "bg-secondary text-secondary-foreground font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
      )}
    >
      {label}
    </Link>
  )
}

export function SiteNav({ groups }: SiteNavProps) {
  return (
    <nav aria-label="Documentation" className="hidden lg:block">
      <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pb-10 pr-4">
        <NavList groups={groups} />
      </div>
    </nav>
  )
}

export function SiteNavMobile({ groups }: SiteNavProps) {
  return (
    <Dialog.Root>
      {/* buttonVariants, not render={<Button />}: Base UI inspects the element
          handed to `render` to decide whether it is a native button, and cannot
          see through a wrapper component — so it warns on every mount even
          though the DOM ends up correct. Base UI renders a real <button> here. */}
      <Dialog.Trigger
        aria-label="Open navigation"
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "lg:hidden")}
      >
        <MenuIcon aria-hidden />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="duration-facade-base fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="bg-background duration-facade-base ease-facade-out fixed inset-y-0 left-0 z-50 flex w-[min(20rem,85vw)] flex-col gap-6 overflow-y-auto border-r p-6 transition-transform data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">Documentation</Dialog.Title>
            <Dialog.Close
              aria-label="Close navigation"
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <XIcon aria-hidden />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Browse Facade UI components and guides.
          </Dialog.Description>
          <NavList groups={groups} />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
