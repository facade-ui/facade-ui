import { readFileSync } from "node:fs"
import { join } from "node:path"

import type { Route } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { CodeBlock } from "@/components/code-block"
import { InstallCommand } from "@/components/install-command"
import { PreviewFrame } from "@/components/preview-frame"
import { PropsTable } from "@/components/props-table"
import { DEMO_INITIAL_HEIGHT, demoSourcePath, hasDemo } from "@/demos"
import {
  getPropsDocs,
  getRegistryItem,
  getRegistryItems,
  installCommands,
} from "@/lib/registry"
import { Badge } from "@registry/ui/badge"

export const dynamicParams = false

export function generateStaticParams() {
  return getRegistryItems().map((item) => ({ name: item.name }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>
}): Promise<Metadata> {
  const { name } = await params
  const item = getRegistryItem(name)
  if (!item) return {}
  return { title: item.title ?? item.name, description: item.description }
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const item = getRegistryItem(name)
  if (!item) notFound()

  const commands = installCommands(name)

  // Joined inline with a literal folder so Turbopack does not trace the project.
  const demoSource = hasDemo(name)
    ? readFileSync(join(process.cwd(), "demos", `${name}.tsx`), "utf8")
    : undefined

  const propsDocs = getPropsDocs(name)

  // Sections come in pairs. Surfacing the other half here saves a hunt through
  // the sidebar, and makes the static-first design visible rather than implied.
  const isMotion = name.endsWith("-motion")
  const counterpart = isMotion ? name.replace(/-motion$/, "") : `${name}-motion`
  const counterpartItem = getRegistryItem(counterpart)

  return (
    <article className="flex max-w-3xl flex-col gap-12 pb-20">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="muted" size="sm">
            {item.type.replace("registry:", "")}
          </Badge>
          {item.categories?.map((category) => (
            <Badge key={category} variant="outline" size="sm">
              {category}
            </Badge>
          ))}
        </div>
        <h1 className="text-display-sm text-balance font-semibold">
          {item.title ?? item.name}
        </h1>
        {item.description ? (
          <p className="text-muted-foreground text-pretty text-lg">{item.description}</p>
        ) : null}

        {counterpartItem ? (
          <p className="text-muted-foreground text-sm">
            {isMotion ? "Wraps the static " : "Also ships a motion variant: "}
            <Link
              href={`/components/${counterpart}` as Route}
              className="text-foreground underline underline-offset-4"
            >
              {counterpartItem.title ?? counterpart}
            </Link>
            {isMotion
              ? ", which renders identically with JavaScript disabled."
              : ". The static one is the default."}
          </p>
        ) : null}
      </header>

      {hasDemo(name) ? (
        <section aria-labelledby="preview" className="flex flex-col gap-4">
          <h2 id="preview" className="text-xl font-semibold">
            Preview
          </h2>
          <PreviewFrame
            name={name}
            title={item.title ?? name}
            initialHeight={DEMO_INITIAL_HEIGHT[name] ?? 360}
            // Anything in the motion category animates on mount or on scroll,
            // which is exactly what Replay exists for.
            animated={item.categories?.includes("motion") ?? false}
          />
        </section>
      ) : null}

      <section aria-labelledby="install" className="flex flex-col gap-4">
        <h2 id="install" className="text-xl font-semibold">
          Installation
        </h2>
        <InstallCommand commands={commands} />
        {item.dependencies?.length || item.registryDependencies?.length ? (
          <p className="text-muted-foreground text-pretty text-sm">
            Pulls in{" "}
            {[
              ...(item.dependencies ?? []),
              ...(item.registryDependencies ?? []).map(
                (url) =>
                  url
                    .split("/")
                    .pop()
                    ?.replace(/\.json$/, "") ?? url,
              ),
            ].join(", ")}
            . The CLI installs them for you.
          </p>
        ) : null}
      </section>

      {demoSource ? (
        <section aria-labelledby="usage" className="flex flex-col gap-4">
          <h2 id="usage" className="text-xl font-semibold">
            Usage
          </h2>
          <p className="text-muted-foreground text-pretty text-sm">
            The exact source of the preview above.
          </p>
          <CodeBlock
            code={demoSource}
            filename={demoSourcePath(name)}
            maxHeight="32rem"
          />
        </section>
      ) : null}

      <section aria-labelledby="source" className="flex flex-col gap-4">
        <h2 id="source" className="text-xl font-semibold">
          Source
        </h2>
        <p className="text-muted-foreground text-pretty text-sm">
          What the CLI copies into your project, byte for byte.
        </p>
        {item.files.map((file) => (
          <CodeBlock
            key={file.path}
            code={file.content}
            lang={file.path.endsWith(".css") ? "css" : "tsx"}
            filename={file.target ?? file.path}
            maxHeight="34rem"
          />
        ))}
      </section>

      {propsDocs.length > 0 ? (
        <section aria-labelledby="props" className="flex flex-col gap-6">
          <h2 id="props" className="text-xl font-semibold">
            Props
          </h2>
          <PropsTable files={propsDocs} />
        </section>
      ) : null}
    </article>
  )
}
