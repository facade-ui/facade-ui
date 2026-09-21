import { SiteHeader } from "@/components/site-header"
import { getNavGroups } from "@/lib/registry"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="bg-background focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:border focus:px-4 focus:py-2 focus:ring-2"
      >
        Skip to content
      </a>
      <SiteHeader groups={getNavGroups()} />
      <main id="main">{children}</main>
    </>
  )
}
