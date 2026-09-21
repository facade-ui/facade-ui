"use client"

/**
 * Banner — the announcement bar above the header.
 *
 * a11y: the things that make announcement bars annoying are all accessibility
 * problems in disguise.
 *
 *  - It is a named `<section>`, so it can be skipped by landmark navigation
 *    rather than being met again on every page.
 *  - Dismissal is a real `<button>` with an accessible name that says what it
 *    dismisses, not a bare "×".
 *  - `aria-live` is deliberately **absent**. A banner that is present on load is
 *    not an update, and announcing it would interrupt whatever the user was
 *    doing. Pass `announce` only when the banner appears in response to
 *    something, which is the case a live region is actually for.
 *  - Nothing is rendered before hydration decides whether it was dismissed, so
 *    a dismissed banner never flashes back on navigation.
 *
 * `storageKey` persists the dismissal in localStorage, read through
 * `useSyncExternalStore` rather than an effect — localStorage *is* an external
 * store, and the effect form schedules a cascading render on every load, which
 * is what `react-hooks/set-state-in-effect` exists to catch.
 *
 * The trade-off that comes with it: the server cannot know whether a visitor
 * dismissed the banner, so it renders, and a returning visitor who dismissed it
 * sees it for one frame. The alternative — render nothing until the stored value
 * is known — shifts the layout for *everyone else*, which is the larger group
 * and the worse outcome. If your banner is dismissed by most visitors, inline a
 * pre-paint script that sets `hidden` on the element, the same way a theme
 * script avoids a flash of the wrong colours.
 *
 * Storage can throw in private mode, so every access is guarded and the banner
 * simply shows.
 *
 * Dependencies: lucide-react, react, @registry/lib/types, @registry/lib/utils,
 * @registry/ui/button, @registry/ui/container.
 */

import { XIcon } from "lucide-react"
import {
  useCallback,
  useState,
  useSyncExternalStore,
  type ElementType,
  type ReactNode,
} from "react"

import type { LinkComponent } from "@registry/lib/types"
import { cn } from "@registry/lib/utils"
import { buttonVariants } from "@registry/ui/button"
import { Container } from "@registry/ui/container"

export interface BannerProps {
  children: ReactNode
  /** Names the landmark, e.g. "Announcement". */
  label?: string
  /** Optional call to action at the end of the message. */
  action?: { label: string; href: string; external?: boolean }
  link?: LinkComponent
  /** Adds a dismiss button. */
  dismissible?: boolean
  /** Remembers the dismissal under this localStorage key. */
  storageKey?: string
  /** What the dismiss button says it is closing. */
  dismissLabel?: string
  variant?: "primary" | "muted" | "card"
  onDismiss?: () => void
  /**
   * Announce the banner when it appears. Only for banners that show in response
   * to an action — never for one that is present on load.
   */
  announce?: boolean
  className?: string
  id?: string
}

const listeners = new Set<() => void>()

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange)
  window.addEventListener("storage", onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener("storage", onChange)
  }
}

function readDismissed(storageKey: string | undefined): boolean {
  if (!storageKey) return false
  try {
    return localStorage.getItem(storageKey) === "dismissed"
  } catch {
    return false
  }
}

const surfaces = {
  primary: "bg-primary text-primary-foreground",
  muted: "bg-muted text-foreground",
  card: "bg-card text-card-foreground border-b",
} as const

export function Banner({
  children,
  label = "Announcement",
  action,
  link,
  dismissible = false,
  storageKey,
  dismissLabel,
  variant = "primary",
  onDismiss,
  announce = false,
  className,
  id,
}: BannerProps) {
  const Link = (link ?? "a") as ElementType

  const storedDismissal = useSyncExternalStore(
    subscribe,
    () => readDismissed(storageKey),
    // The server has no storage; not-dismissed is the right assumption.
    () => false,
  )
  // Without a `storageKey` there is nothing to read back, so the dismissal has
  // to live in component state for the rest of the session.
  const [sessionDismissed, setSessionDismissed] = useState(false)
  const dismissed = storedDismissal || sessionDismissed

  const dismiss = useCallback(() => {
    setSessionDismissed(true)
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, "dismissed")
      } catch {
        // Dismissal simply does not persist.
      }
      for (const listener of [...listeners]) listener()
    }
    onDismiss?.()
  }, [storageKey, onDismiss])

  if (dismissed) return null

  return (
    <section
      id={id}
      aria-label={label}
      {...(announce ? { role: "status", "aria-live": "polite" as const } : {})}
      className={cn("relative w-full text-sm", surfaces[variant], className)}
    >
      <Container className="flex min-h-12 flex-wrap items-center justify-center gap-x-4 gap-y-2 py-2.5 pr-12 text-center">
        <p className="text-pretty">{children}</p>

        {action ? (
          <Link
            href={action.href}
            {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="focus-visible:ring-ring rounded-sm font-medium underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2"
          >
            {action.label}
            {action.external ? (
              <span className="sr-only"> (opens in a new tab)</span>
            ) : null}
          </Link>
        ) : null}
      </Container>

      {dismissible ? (
        <button
          type="button"
          onClick={dismiss}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "absolute right-2 top-1/2 size-9 -translate-y-1/2",
            variant === "primary" &&
              "hover:bg-primary-foreground/15 hover:text-primary-foreground",
          )}
        >
          <XIcon aria-hidden focusable="false" className="size-4" />
          <span className="sr-only">
            {dismissLabel ?? `Dismiss ${label.toLowerCase()}`}
          </span>
        </button>
      ) : null}
    </section>
  )
}
