import type { Metadata, Viewport } from "next"

import "./globals.css"
import { Analytics } from "@vercel/analytics/next"
import { CustomThemeStyle } from "@/components/custom-theme-style"
import { themeInitScript } from "@/components/theme-switcher"

export const metadata: Metadata = {
  metadataBase: new URL("https://facadeui.dev"),
  title: {
    default: "Facade UI — sections for marketing websites",
    template: "%s — Facade UI",
  },
  description:
    "Sections and page templates for marketing websites: heroes, feature grids, pricing tables, FAQs and footers. Free and open source. Install them with the shadcn CLI.",
  // Every page's canonical URL is its own; the default image comes from
  // `opengraph-image.tsx`.
  alternates: { canonical: "./" },
  twitter: { card: "summary_large_image" },
  openGraph: {
    type: "website",
    siteName: "Facade UI",
    title: "Facade UI — sections for marketing websites",
    description:
      "Sections and page templates for marketing websites, installed with the shadcn CLI. Built with React, Base UI and Tailwind v4, and tested against WCAG 2.2 AA.",
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
        <Analytics />
      </body>
    </html>
  )
}
