import type { Metadata } from "next"
import Link from "next/link"

import { getRegistryItems } from "@/lib/registry"
import { SiteHeader } from "@/components/site-header"
import { getNavGroups } from "@/lib/registry"
import { buttonVariants } from "@registry/ui/button"
import { Container } from "@registry/ui/container"
import { Section } from "@registry/ui/section"
import { SectionHeader } from "@registry/ui/section-header"

export const metadata: Metadata = {
  title: "Templates",
  description:
    "Complete marketing pages built from Facade UI sections: a SaaS landing page, an agency site, a product launch, a changelog and a documentation page. Install one with a single command.",
  alternates: { canonical: "/templates" },
}

export default function TemplatesPage() {
  const templates = getRegistryItems().filter((item) =>
    item.categories?.includes("template"),
  )

  return (
    <>
      <SiteHeader groups={getNavGroups()} />
      <main id="main">
        <Section labelledBy="templates" spacing="md">
          <Container className="flex flex-col gap-10">
            <SectionHeader
              titleId="templates"
              headingLevel={1}
              size="lg"
              eyebrow="Templates"
              title="Whole pages, one command"
              description="Each template is composition over the sections in the registry, with one content object. Install it, replace the content, and remove what you do not need."
            />
            <ul className="grid gap-6 md:grid-cols-3">
              {templates.map((item) => (
                <li
                  key={item.name}
                  className="bg-card text-card-foreground flex flex-col gap-4 rounded-xl border p-6"
                >
                  <h2 className="text-lg font-semibold">{item.title ?? item.name}</h2>
                  <p className="text-muted-foreground flex-1 text-pretty text-sm">
                    {item.description}
                  </p>
                  <code className="bg-muted rounded px-2 py-1 font-mono text-xs">
                    npx shadcn@latest add @facade/{item.name}
                  </code>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/templates/${item.name}`}
                      className={buttonVariants({ size: "sm" })}
                    >
                      View the page
                    </Link>
                    <Link
                      href={`/components/${item.name}`}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      Docs
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      </main>
    </>
  )
}
