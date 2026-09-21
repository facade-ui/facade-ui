/**
 * Shared model for the registry build and its validator.
 *
 * The one rule worth stating up front: `dependencies` and `registryDependencies`
 * are *derived* from the real import graph, never hand-written. A section that
 * starts using `motion` picks up the dependency automatically, and a stale entry
 * is impossible rather than merely discouraged.
 */

import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const here = dirname(fileURLToPath(import.meta.url))

export const REPO_ROOT = resolve(here, "../..")
export const REGISTRY_ROOT = resolve(REPO_ROOT, "packages/registry")
export const REGISTRY_JSON = resolve(REGISTRY_ROOT, "registry.json")
export const OUTPUT_DIR = resolve(REPO_ROOT, "apps/docs/public/r")

export const REGISTRY_HOMEPAGE = "https://facadeui.dev"
export const REGISTRY_BASE_URL = `${REGISTRY_HOMEPAGE}/r`

export const ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json"
export const REGISTRY_SCHEMA = "https://ui.shadcn.com/schema/registry.json"

export interface RegistryFile {
  path: string
  type: string
  target?: string
  content?: string
}

export interface RegistryItem {
  name: string
  type: string
  title?: string
  description?: string
  categories?: string[]
  files: RegistryFile[]
  dependencies?: string[]
  registryDependencies?: string[]
  docs?: string
  meta?: Record<string, unknown>
}

export interface Registry {
  $schema?: string
  name: string
  homepage: string
  items: RegistryItem[]
}

export const readRegistry = (): Registry =>
  JSON.parse(readFileSync(REGISTRY_JSON, "utf8")) as Registry

/**
 * Source alias -> the path the file lands on in a consumer's project.
 *
 * `@registry/*` exists only inside this repo. Consumers get shadcn's own
 * aliases, which is what makes an installed section look like code they wrote.
 */
export const ALIAS_REWRITES: [RegExp, string][] = [
  [/@registry\/lib\//g, "@/lib/"],
  [/@registry\/ui\//g, "@/components/ui/"],
  [/@registry\/motion\//g, "@/components/motion/"],
  [/@registry\/sections\//g, "@/components/sections/"],
  [/@registry\/templates\//g, "@/components/templates/"],
]

/** Rewrites in-repo aliases to consumer aliases, in code and in doc comments. */
export function rewriteAliases(source: string): string {
  return ALIAS_REWRITES.reduce(
    (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
    source,
  )
}

const IMPORT_RE = /(?:^|\n)\s*(?:import|export)[\s\S]*?from\s+["']([^"']+)["']/g

/** Every module specifier a file imports from, in source order. */
export function importsOf(source: string): string[] {
  const found: string[] = []
  let match: RegExpExecArray | null
  const re = new RegExp(IMPORT_RE)
  while ((match = re.exec(source)) !== null) found.push(match[1]!)
  return found
}

/** `motion/react` -> `motion`, `@base-ui-components/react/button` -> the package. */
export function packageNameOf(specifier: string): string {
  if (specifier.startsWith("@")) {
    const [scope, name] = specifier.split("/")
    return name ? `${scope}/${name}` : specifier
  }
  return specifier.split("/")[0]!
}

/** Bare specifiers that a consumer already has and must never be reinstalled. */
export const PROVIDED_PACKAGES = new Set(["react", "react-dom", "next"])

const registryPkg = JSON.parse(
  readFileSync(resolve(REGISTRY_ROOT, "package.json"), "utf8"),
) as {
  dependencies?: Record<string, string>
}

/** Pins an npm dependency to the range this repo builds and tests against. */
export function withVersion(pkg: string): string {
  const range = registryPkg.dependencies?.[pkg]
  return range ? `${pkg}@${range}` : pkg
}

export const itemUrl = (name: string): string => `${REGISTRY_BASE_URL}/${name}.json`
