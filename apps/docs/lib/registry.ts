/**
 * Reads the built registry from disk at render time.
 *
 * The docs site consumes exactly what it publishes: `public/r/*.json` is the
 * same payload `npx shadcn add` fetches, so the code tab cannot show source that
 * differs from what a visitor installs.
 */

import { readFileSync } from "node:fs"
import { join } from "node:path"

import type { Route } from "next"

import type { FileDoc } from "@scripts/props-types"

export {
  PACKAGE_MANAGERS,
  REGISTRY_URL,
  installCommand,
  installCommands,
  type PackageManager,
} from "./registry-shared"

export interface RegistryFile {
  path: string
  type: string
  target?: string
  content: string
}

export interface RegistryItem {
  name: string
  type: string
  title?: string
  description?: string
  categories?: string[]
  dependencies?: string[]
  registryDependencies?: string[]
  files: RegistryFile[]
}

export interface RegistryIndex {
  name: string
  homepage: string
  items: Omit<RegistryItem, "files"> & { files: Omit<RegistryFile, "content">[] }[]
}

/**
 * Paths are joined inline rather than through a precomputed directory constant.
 * Turbopack's build tracer only recognises a read as safely scoped when the
 * static folder is visible at the call site; hiding it behind a variable makes
 * it trace — and bundle — the entire project.
 */
const readJson = <T>(path: string): T => JSON.parse(readFileSync(path, "utf8")) as T

let cachedIndex: RegistryItem[] | undefined

/** Every published item, in catalogue order. */
export function getRegistryItems(): RegistryItem[] {
  if (cachedIndex) return cachedIndex
  const index = readJson<{ items: { name: string }[] }>(
    join(process.cwd(), "public/r", "index.json"),
  )
  cachedIndex = index.items.map((entry) => getRegistryItem(entry.name)!)
  return cachedIndex
}

export function getRegistryItem(name: string): RegistryItem | undefined {
  try {
    return readJson<RegistryItem>(join(process.cwd(), "public/r", `${name}.json`))
  } catch {
    return undefined
  }
}

let cachedProps: Record<string, FileDoc[]> | undefined

/** Props tables extracted from the registry source by `scripts/extract-props.ts`. */
export function getPropsDocs(name: string): FileDoc[] {
  cachedProps ??= readJson<Record<string, FileDoc[]>>(
    join(process.cwd(), ".generated", "props.json"),
  )
  return cachedProps[name] ?? []
}

export interface NavGroup {
  title: string
  /** `href` is a `Route` because typedRoutes cannot narrow a registry-derived path. */
  items: { name: string; title: string; href: Route }[]
}

const CATEGORY_TITLES: Record<string, string> = {
  theme: "Theming",
  motion: "Motion",
  atom: "Atoms",
  section: "Sections",
  template: "Templates",
}

const CATEGORY_ORDER = ["theme", "motion", "atom", "section", "template", "other"]

/** Groups the catalogue into the sidebar's sections. */
export function getNavGroups(): NavGroup[] {
  const groups = new Map<string, NavGroup>()

  for (const item of getRegistryItems()) {
    const category = item.categories?.[0] ?? "other"
    const group = groups.get(category) ?? {
      title: CATEGORY_TITLES[category] ?? "Other",
      items: [],
    }
    group.items.push({
      name: item.name,
      title: item.title ?? item.name,
      href: `/components/${item.name}` as Route,
    })
    groups.set(category, group)
  }

  return CATEGORY_ORDER.filter((key) => groups.has(key)).map((key) => groups.get(key)!)
}
