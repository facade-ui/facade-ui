/**
 * The site header: brand mark and wordmark, primary links, theme controls, and
 * — below `lg` — the trigger for the navigation drawer.
 *
 * a11y: a `<header>` landmark containing a named `<nav>`, and a skip link that
 * is the first focusable element on the page so keyboard users can jump past the
 * whole chrome in one keystroke.
 */

import Link from "next/link"

import type { NavGroup } from "@/lib/registry"
import { buttonVariants } from "@registry/ui/button"
import { Container } from "@registry/ui/container"
import { FacadeMark } from "./facade-mark"
import { SiteNavMobile } from "./site-nav"
import { ThemeSwitcher } from "./theme-switcher"

const STATIC_LINKS = [
  { href: "/docs/installation", label: "Docs" },
  { href: "/components", label: "Components" },
  { href: "/docs/theming", label: "Theming" },
] as const

export interface SiteHeaderProps {
  groups: NavGroup[]
}

export function SiteHeader({ groups }: SiteHeaderProps) {
  return (
    <header className="border-border bg-background/85 sticky top-0 z-40 border-b backdrop-blur-md">
      <Container className="flex h-16 items-center gap-4">
        <SiteNavMobile groups={groups} />

        <Link
          href="/"
          className="focus-visible:ring-ring flex items-center gap-2 rounded-md text-base font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2"
        >
          <FacadeMark className="size-5 shrink-0" />
          Facade&nbsp;UI
        </Link>

        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 md:flex">
          {STATIC_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitcher />
          <a
            href="https://github.com/facade-ui/facade-ui"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </Container>
    </header>
  )
}
