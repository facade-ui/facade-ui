"use client"

/**
 * Renders a component preview inside an iframe at a chosen viewport width.
 *
 * The iframe is not decoration. Tailwind's `sm:` / `md:` / `lg:` utilities are
 * *viewport* media queries, so resizing a `<div>` changes nothing about which of
 * them apply — a "375px preview" built that way would quietly show the desktop
 * layout at a narrow width and lie about responsive behaviour. A real iframe has
 * its own viewport, so the breakpoints resolve honestly.
 *
 * Height and theme are synced over postMessage rather than by reloading the
 * frame, so toggling dark mode does not lose the preview's own state.
 *
 * Two escape hatches sit above the frame:
 *
 *  - **Replay**, for previews that animate. Entrance motion plays once and then
 *    the preview is a still image, which is no way to evaluate it. Replay
 *    re-navigates the frame with a changing query parameter rather than calling
 *    `reload()`, because a reload can be served from the back/forward cache and
 *    restore the finished state instead of replaying from the start.
 *  - **Open in a new tab**, because the docs column is narrower than a real
 *    page. It is a plain link, so middle-click and "open in new window" work the
 *    way the browser's own affordances do. The standalone page picks up the same
 *    theme on its own: the root layout's pre-paint script reads the same
 *    localStorage keys the theme switcher writes.
 *
 * a11y: the iframe carries a title; the width control is a labelled radio group
 * so the current breakpoint is announced, not just coloured; and Replay
 * announces that it restarted through a polite live region, since the change it
 * makes is purely visual.
 */

import {
  ExpandIcon,
  ExternalLinkIcon,
  MonitorIcon,
  RotateCcwIcon,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { buttonVariants } from "@registry/ui/button"
import { cn } from "@registry/lib/utils"

const WIDTHS = [
  { value: 375, label: "Mobile, 375 pixels", short: "375", icon: SmartphoneIcon },
  { value: 768, label: "Tablet, 768 pixels", short: "768", icon: TabletIcon },
  { value: 1280, label: "Desktop, 1280 pixels", short: "1280", icon: MonitorIcon },
  { value: 0, label: "Full width", short: "Full", icon: ExpandIcon },
] as const

export interface PreviewFrameProps {
  /** Registry item name; the frame loads `/preview/<name>`. */
  name: string
  title: string
  /** Starting height in px before the frame reports its own. */
  initialHeight?: number
  /**
   * Shows the Replay control. Set for anything that animates on mount or on
   * scroll — otherwise the button would be a no-op the user cannot predict.
   */
  animated?: boolean
}

export function PreviewFrame({
  name,
  title,
  initialHeight = 420,
  animated = false,
}: PreviewFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState(initialHeight)
  // Bumping this changes the frame's src, which forces a fresh document.
  const [replayCount, setReplayCount] = useState(0)

  const src =
    replayCount === 0 ? `/preview/${name}` : `/preview/${name}?replay=${replayCount}`

  // Mirror the docs' own theme into the frame whenever either axis changes.
  const syncTheme = useCallback(() => {
    const frame = frameRef.current?.contentWindow
    if (!frame) return
    frame.postMessage(
      {
        type: "facade:theme",
        dark: document.documentElement.classList.contains("dark"),
        preset: document.documentElement.dataset.facadeTheme ?? "neutral",
      },
      window.location.origin,
    )
  }, [])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      const data = event.data as { type?: string; name?: string; height?: number }
      if (
        data.type === "facade:height" &&
        data.name === name &&
        typeof data.height === "number"
      ) {
        setHeight(Math.max(160, Math.ceil(data.height)))
      }
      if (data.type === "facade:ready" && data.name === name) syncTheme()
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [name, syncTheme])

  useEffect(() => {
    const observer = new MutationObserver(syncTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-facade-theme"],
    })
    return () => observer.disconnect()
  }, [syncTheme])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {animated ? (
          <button
            type="button"
            onClick={() => setReplayCount((count) => count + 1)}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 px-2.5 text-xs",
            )}
          >
            <RotateCcwIcon aria-hidden className="size-3.5" />
            Replay
          </button>
        ) : null}

        {/* The clean path, not `src`: the replay counter is transient state and
            has no business in a URL someone might copy or bookmark. */}
        <a
          href={`/preview/${name}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "h-8 px-2.5 text-xs",
          )}
        >
          <ExternalLinkIcon aria-hidden className="size-3.5" />
          Open full width
          <span className="sr-only"> (opens in a new tab)</span>
        </a>

        {/* Replay changes nothing in the accessibility tree, so the fact that it
            happened has to be said out loud. */}
        <span aria-live="polite" className="sr-only">
          {replayCount > 0 ? `${title} preview restarted` : ""}
        </span>

        <fieldset className="border-border ml-auto flex items-center gap-0.5 rounded-lg border p-0.5">
          <legend className="sr-only">Preview width</legend>
          {WIDTHS.map(({ value, label, short, icon: Icon }) => (
            <label
              key={value}
              title={label}
              className={cn(
                "flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-xs transition-colors",
                "has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-2",
                width === value
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <input
                type="radio"
                name={`preview-width-${name}`}
                value={value}
                checked={width === value}
                onChange={() => setWidth(value)}
                aria-label={label}
                className="sr-only"
              />
              {/* The name comes from aria-label, so the visible text stays hidden
                from assistive tech and cannot double up with it. */}
              <Icon aria-hidden className="size-3.5" />
              <span aria-hidden>{short}</span>
            </label>
          ))}
        </fieldset>
      </div>

      <div className="bg-muted/30 flex justify-center overflow-hidden rounded-xl border p-2 sm:p-4">
        <iframe
          ref={frameRef}
          src={src}
          title={`${title} preview`}
          loading="lazy"
          onLoad={syncTheme}
          className="bg-background duration-facade-base ease-facade-out max-w-full rounded-lg border shadow-sm transition-[width]"
          style={{ width: width === 0 ? "100%" : width, height }}
        />
      </div>
    </div>
  )
}
