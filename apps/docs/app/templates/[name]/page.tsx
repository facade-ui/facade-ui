import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { CopyButton } from "@/components/copy-button"
import { demos } from "@/demos"
import { getRegistryItem, getRegistryItems } from "@/lib/registry"
import { FacadeMotionProvider } from "@registry/motion/facade-motion-provider"
import { buttonVariants } from "@registry/ui/button"
import { cn } from "@registry/lib/utils"

export const dynamicParams = false

const templates = () =>
  getRegistryItems().filter((item) => item.categories?.includes("template"))

export function generateStaticParams() {
  return templates().map((item) => ({ name: item.name }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>
}): Promise<Metadata> {
  const { name } = await params
  const item = getRegistryItem(name)
  if (!item) return {}
  return {
    title: `${item.title ?? name} template`,
    description: item.description,
    alternates: { canonical: `/templates/${name}` },
  }
}

/** The template rendered as a full page, with the install command pinned below. */
export default async function TemplatePage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const item = getRegistryItem(name)
  const Demo = demos[name]
  if (!item || !Demo || !item.categories?.includes("template")) notFound()

  const command = `npx shadcn@latest add @facade/${name}`

  return (
    <FacadeMotionProvider>
      {/* Template demos undo the preview padding; give them the same to undo. */}
      <div className="p-6 pb-28 sm:p-10 sm:pb-28">
        <Demo />
      </div>
      <aside
        aria-label="Install this template"
        className="bg-background/90 border-border fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-md"
      >
        <div className="max-w-facade mx-auto flex flex-wrap items-center gap-3 px-5 py-3 sm:px-8">
          <p className="text-sm font-medium">{item.title ?? name}</p>
          <code className="bg-muted hidden rounded px-2 py-1 font-mono text-xs sm:inline">
            {command}
          </code>
          <CopyButton value={command} label="Copy command" />
          <Link
            href={`/components/${name}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "ml-auto h-8 px-2.5 text-xs",
            )}
          >
            Docs and source
          </Link>
        </div>
      </aside>
    </FacadeMotionProvider>
  )
}
