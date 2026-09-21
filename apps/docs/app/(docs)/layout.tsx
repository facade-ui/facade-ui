import { SiteHeader } from "@/components/site-header"
import { SiteNav } from "@/components/site-nav"
import { Container } from "@registry/ui/container"
import { getNavGroups } from "@/lib/registry"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const groups = getNavGroups()

  return (
    <>
      <a
        href="#main"
        className="bg-background focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:border focus:px-4 focus:py-2 focus:ring-2"
      >
        Skip to content
      </a>
      <SiteHeader groups={groups} />
      <Container className="grid gap-10 py-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <SiteNav groups={groups} />
        <main id="main" className="min-w-0">
          {children}
        </main>
      </Container>
    </>
  )
}
