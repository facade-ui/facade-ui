import type { Metadata, Viewport } from "next"

import "./globals.css"
import { CustomThemeStyle } from "@/components/custom-theme-style"
import { themeInitScript } from "@/components/theme-switcher"

export const metadata: Metadata = {
  metadataBase: new URL("https://facadeui.dev"),
  title: {
    default: "Facade UI — marketing sections for React",
    template: "%s — Facade UI",
  },
  description:
    "Free, open-source marketing sections and components for React. Install one with the shadcn CLI, and its source code is copied into your project.",
  openGraph: {
    type: "website",
    siteName: "Facade UI",
    title: "Facade UI — marketing sections for React",
    description:
      "Marketing sections and components you install with the shadcn CLI. Built with React, Base UI and Tailwind v4, and tested against WCAG 2.2 AA.",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a09" },
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
        {/* Applies the reader's own palette, on every route including the
            preview iframes. */}
        <CustomThemeStyle />
        {children}
      </body>
    </html>
  )
}
