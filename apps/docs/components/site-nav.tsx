"use client"

/**
 * The docs sidebar.
 *
 * a11y: a `<nav>` with an accessible name, and the current page marked with
 * `aria-current="page"` so it is announced, not merely highlighted. On small
 * screens it collapses into a Base UI Dialog — a real modal with the focus trap,
 * Escape handling, scroll lock and focus restoration a drawer needs.
 */

import { Dialog } from "@base-ui-components/react/dialog"
import { MenuIcon, XIcon } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { usePathname } from "next/navigation"

import type { NavGroup } from "@/lib/registry"
import { Button } from "@registry/ui/button"
import { cn } from "@registry/lib/utils"

const GUIDE_LINKS = [
  { href: "/docs/installation", label: "Installation" },
  { href: "/docs/theming", label: "Theming" },
  { href: "/docs/accessibility", label: "Accessibility" },
] as const

export interface SiteNavProps {
  groups: NavGroup[]
}

function NavList({ groups, onNavigate }: SiteNavProps & { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-1">
        <p className="text-foreground px-3 text-sm font-semibold">Getting started</p>
        {GUIDE_LINKS.map((link) => (
          <NavLink
            key={link.href}
            href={link.href}
            label={link.label}
            active={pathname === link.href}
            onNavigate={onNavigate}
          />
        ))}
      </div>

      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-1">
          <p className="text-foreground px-3 text-sm font-semibold">{group.title}</p>
          {group.items.map((item) => (
            <NavLink
              key={item.name}
              href={item.href}
              label={item.title}
              active={pathname === item.href}
              onNavigate={onNavigate}
            />
          ))}
        </div>
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
      <Dialog.Trigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
          />
        }
      >
        <MenuIcon aria-hidden />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="duration-facade-base fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="bg-background duration-facade-base ease-facade-out fixed inset-y-0 left-0 z-50 flex w-[min(20rem,85vw)] flex-col gap-6 overflow-y-auto border-r p-6 transition-transform data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold">Documentation</Dialog.Title>
            <Dialog.Close
              render={
                <Button variant="ghost" size="icon" aria-label="Close navigation" />
              }
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
