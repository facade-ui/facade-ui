"use client"

/**
 * The iframe side of the preview protocol.
 *
 * Reports its content height to the parent so the frame can size itself to the
 * demo, and applies theme changes pushed down from the docs chrome. Messages are
 * origin-checked in both directions.
 */

import { useEffect, type ReactNode } from "react"

export interface PreviewBridgeProps {
  name: string
  children: ReactNode
}

export function PreviewBridge({ name, children }: PreviewBridgeProps) {
  useEffect(() => {
    const post = (message: Record<string, unknown>) => {
      window.parent.postMessage({ ...message, name }, window.location.origin)
    }

    const report = () =>
      post({ type: "facade:height", height: document.body.scrollHeight })

    const observer = new ResizeObserver(report)
    observer.observe(document.body)

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      const data = event.data as { type?: string; dark?: boolean; preset?: string }
      if (data.type !== "facade:theme") return
      document.documentElement.classList.toggle("dark", Boolean(data.dark))
      if (!data.preset || data.preset === "neutral") {
        document.documentElement.removeAttribute("data-facade-theme")
      } else {
        document.documentElement.setAttribute("data-facade-theme", data.preset)
      }
      report()
    }

    window.addEventListener("message", onMessage)
    post({ type: "facade:ready" })
    report()

    return () => {
      observer.disconnect()
      window.removeEventListener("message", onMessage)
    }
  }, [name])

  return <>{children}</>
}
