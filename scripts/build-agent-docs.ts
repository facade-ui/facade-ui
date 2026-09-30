/**
 * Emits the docs as plain markdown, for AI agents and anyone else who would
 * rather not parse HTML.
 *
 *  - `public/components/<name>.md`: one page per registry item, built from the
 *    built item JSON, the props tables and the demo source.
 *  - `public/docs/<slug>.md`: the guides, copied from `apps/docs/content/docs`.
 *  - `public/llms.txt`: the index, in the llms.txt format; `llms-full.txt` is
 *    every page in one file.
 *
 * Runs after `build-registry.ts` and `extract-props.ts` in the docs `registry`
 * script. Output is gitignored.
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { basename, resolve } from "node:path"

import type { FileDoc } from "./lib/props-types.ts"
import {
  OUTPUT_DIR,
  REGISTRY_HOMEPAGE,
  REPO_ROOT,
  itemUrl,
  rewriteAliases,
} from "./lib/registry.ts"

const DOCS_APP = resolve(REPO_ROOT, "apps/docs")
const PUBLIC = resolve(DOCS_APP, "public")
const GUIDES = resolve(DOCS_APP, "content/docs")
const DEMOS = resolve(DOCS_APP, "demos")

/** The guides, in reading order. */
const GUIDE_ORDER = ["installation", "theming", "customise", "accessibility", "agents"]

interface BuiltItem {
  name: string
  type: string
  title?: string
  description?: string
  categories?: string[]
  dependencies?: string[]
  registryDependencies?: string[]
  files: { path: string; type: string; target?: string }[]
  docs?: string
}

const registry = JSON.parse(
  readFileSync(resolve(OUTPUT_DIR, "registry.json"), "utf8"),
) as { items: BuiltItem[] }
const props = JSON.parse(
  readFileSync(resolve(DOCS_APP, ".generated/props.json"), "utf8"),
) as Record<string, FileDoc[]>

const page = (path: string) => `${REGISTRY_HOMEPAGE}${path}`
const cell = (text = "") => text.replace(/\|/g, "\\|").replace(/\n/g, " ")

function propsTables(name: string): string {
  const files = props[name] ?? []
  const out: string[] = []
  for (const file of files) {
    for (const iface of file.interfaces) {
      if (iface.props.length === 0) continue
      out.push(`### ${iface.name}`)
      if (iface.description) out.push("", iface.description)
      if (iface.extends.length) out.push("", `Extends ${iface.extends.join(", ")}.`)
      out.push("", "| Prop | Type | Default | Description |", "| --- | --- | --- | --- |")
      for (const prop of iface.props) {
        out.push(
          `| \`${prop.name}\`${prop.required ? " (required)" : ""} | \`${cell(prop.type)}\` | ${prop.defaultValue ? `\`${cell(prop.defaultValue)}\`` : ""} | ${cell(prop.description)} |`,
        )
      }
      out.push("")
    }
  }
  return out.join("\n").trim()
}

function componentPage(item: BuiltItem): string {
  const title = item.title ?? item.name
  const deps = [
    ...(item.dependencies ?? []),
    ...(item.registryDependencies ?? []).map(
      (url) => `@facade/${basename(url, ".json")}`,
    ),
  ]
  const demoPath = resolve(DEMOS, `${item.name}.tsx`)
  const demo = existsSync(demoPath)
    ? rewriteAliases(readFileSync(demoPath, "utf8"))
    : null
  const tables = propsTables(item.name)

  const lines = [
    `# ${title}`,
    "",
    ...(item.description ? [`> ${item.description}`, ""] : []),
    `Facade UI item \`${item.name}\` (${item.type.replace("registry:", "")}${item.categories?.length ? `, ${item.categories.join(", ")}` : ""}).`,
    `Docs page: ${page(`/components/${item.name}`)} · Registry JSON: ${itemUrl(item.name)}`,
    "",
    "## Install",
    "",
    "```bash",
    `npx shadcn@latest add @facade/${item.name}`,
    "```",
    "",
    `Or by URL: \`npx shadcn@latest add ${itemUrl(item.name)}\`. The CLI also installs ${deps.length ? `what it needs: ${deps.join(", ")}` : "nothing else"}.`,
    "",
    `Files: ${item.files.map((file) => `\`${file.target ?? file.path}\``).join(", ")}`,
    ...(item.docs ? ["", item.docs] : []),
  ]

  if (registry.items.some((other) => other.name === `${item.name}-demo`)) {
    lines.push(
      "",
      `Usage example as an installable item: \`npx shadcn@latest add @facade/${item.name}-demo\` (lands in components/examples/).`,
    )
  }

  if (demo) {
    lines.push(
      "",
      "## Usage",
      "",
      "The source of the preview on the docs page. `./content` holds sample data.",
      "",
      "```tsx",
      demo.trimEnd(),
      "```",
    )
  }
  if (tables) lines.push("", "## Props", "", tables)
  return lines.join("\n") + "\n"
}

// ------------------------------------------------------------------ write

for (const dir of ["components", "docs"]) {
  rmSync(resolve(PUBLIC, dir), { recursive: true, force: true })
  mkdirSync(resolve(PUBLIC, dir), { recursive: true })
}

// Examples are installable but not pages; each component page names its own.
const componentPages = registry.items
  .filter((item) => !item.categories?.includes("example"))
  .map((item) => ({ item, markdown: componentPage(item) }))
for (const { item, markdown } of componentPages) {
  writeFileSync(resolve(PUBLIC, "components", `${item.name}.md`), markdown)
}

const guides = readdirSync(GUIDES)
  .filter((file) => file.endsWith(".md"))
  .map((file) => basename(file, ".md"))
  .sort((a, b) => GUIDE_ORDER.indexOf(a) - GUIDE_ORDER.indexOf(b))
for (const slug of guides) {
  copyFileSync(resolve(GUIDES, `${slug}.md`), resolve(PUBLIC, "docs", `${slug}.md`))
}

const guideTitle = (slug: string): string =>
  /^#\s+(.+)$/m.exec(readFileSync(resolve(GUIDES, `${slug}.md`), "utf8"))?.[1] ?? slug

const byCategory = (category: string) =>
  componentPages.filter(({ item }) => item.categories?.includes(category))
const groups: [string, typeof componentPages][] = [
  ["Sections", byCategory("section")],
  ["Motion", byCategory("motion")],
  ["Templates", byCategory("template")],
  ["Atoms", byCategory("atom")],
  ["Theme", byCategory("theme")],
]
const listed = new Set(groups.flatMap(([, pages]) => pages.map(({ item }) => item.name)))
groups.push(["Utilities", componentPages.filter(({ item }) => !listed.has(item.name))])

const llms = [
  "# Facade UI",
  "",
  "> Accessible sections and page templates for marketing websites: heroes, feature grids, pricing tables, FAQs and footers. Free and open source (MIT). Install a piece with the shadcn CLI and its source code is copied into your project.",
  "",
  "Built with React 19 (server components by default), Base UI and Tailwind CSS v4. Sections use shadcn's colour variable names, so they take an existing shadcn theme. Every item is tested against WCAG 2.2 AA.",
  "",
  `Install: \`npx shadcn@latest add @facade/<name>\` (registry namespace \`@facade\`, URL form \`${itemUrl("<name>")}\`). Import \`styles/facade-tokens.css\` after Tailwind first. Full index: ${itemUrl("registry")}.`,
  "",
  "## Guides",
  "",
  ...guides.map((slug) => `- [${guideTitle(slug)}](${page(`/docs/${slug}.md`)})`),
  ...groups.flatMap(([heading, pages]) =>
    pages.length
      ? [
          "",
          `## ${heading}`,
          "",
          ...pages.map(
            ({ item }) =>
              `- [${item.title ?? item.name}](${page(`/components/${item.name}.md`)}): ${item.description ?? ""}`,
          ),
        ]
      : [],
  ),
  "",
  "## Optional",
  "",
  `- [Source on GitHub](https://github.com/facade-ui/facade-ui)`,
  `- [Registry index (JSON)](${itemUrl("registry")})`,
  "",
]
writeFileSync(resolve(PUBLIC, "llms.txt"), llms.join("\n"))

const full = [
  llms.join("\n"),
  ...guides.map((slug) => readFileSync(resolve(GUIDES, `${slug}.md`), "utf8")),
  ...componentPages.map(({ markdown }) => markdown),
]
writeFileSync(resolve(PUBLIC, "llms-full.txt"), full.join("\n\n---\n\n"))

console.log(
  `Wrote llms.txt, llms-full.txt, ${componentPages.length} component pages and ${guides.length} guides as markdown.`,
)
