import type { Metadata } from "next"
import Link from "next/link"

import { getNavGroups } from "@/lib/registry"
import { Badge } from "@registry/ui/badge"

export const metadata: Metadata = {
  title: "Components",
  description: "Every item in the Facade UI registry.",
}

export default function ComponentsIndex() {
  const groups = getNavGroups()

  return (
    <div className="flex max-w-3xl flex-col gap-12 pb-20">
      <header className="flex flex-col gap-4">
        <h1 className="text-display-sm font-semibold">Components</h1>
        <p className="text-muted-foreground text-pretty text-lg">
          Every item in the registry. Install any of them with the shadcn CLI; the source
          lands in your project and becomes yours.
        </p>
      </header>

      {groups.map((group) => (
        <section
          key={group.title}
          aria-labelledby={`group-${group.title}`}
          className="flex flex-col gap-4"
        >
          <h2 id={`group-${group.title}`} className="text-xl font-semibold">
            {group.title}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {group.items.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="bg-card hover:border-ring focus-visible:ring-ring flex h-full flex-col gap-1 rounded-lg border p-4 transition-colors focus-visible:outline-none focus-visible:ring-2"
                >
                  <span className="font-medium">{item.title}</span>
                  <Badge variant="muted" size="sm" className="w-fit font-mono">
                    {item.name}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
