import type { Metadata, Viewport } from "next"

import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { themeInitScript } from "@/components/theme-switcher"

export const metadata: Metadata = {
  metadataBase: new URL("https://facadeui.dev"),
  title: {
    default: "Facade UI — the front of every great website",
    template: "%s — Facade UI",
  },
  description:
    "A free, open-source registry of marketing sections, atoms and a design system. Install with the shadcn CLI; the source lands in your project.",
  openGraph: {
    type: "website",
    siteName: "Facade UI",
    title: "Facade UI — the front of every great website",
    description:
      "Marketing sections and a design system you install with the shadcn CLI. React, Base UI, Tailwind v4, WCAG 2.2 AA.",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Runs before paint so the page never flashes the wrong theme. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
