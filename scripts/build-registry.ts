/**
 * Builds the public shadcn-compatible registry into `apps/docs/public/r/`.
 *
 * For every item in `packages/registry/registry.json` this:
 *
 *  1. reads each source file and rewrites `@registry/*` to the consumer aliases
 *     shadcn installs into (`@/lib/*`, `@/components/ui/*`, …);
 *  2. derives `dependencies` from the real import graph, version-pinned to the
 *     ranges this repo builds against;
 *  3. derives `registryDependencies` by resolving cross-item imports to their
 *     owning item's public URL;
 *  4. writes `<name>.json` plus an `index.json` listing.
 *
 * It also writes the derived dependency arrays back into `registry.json`, so the
 * checked-in source of truth stays reviewable. `--check` makes the script fail
 * instead of writing, which is what CI runs.
 *
 * Output is run through Prettier rather than plain `JSON.stringify`. The two
 * disagree — Prettier collapses short arrays onto one line, `JSON.stringify`
 * always expands them — so without this, `pnpm format:check` and
 * `pnpm registry:build --check` fight over the same file and which one passes
 * depends on the order they ran in.
 *
 * Usage: `pnpm registry:build [--check]`
 */

import {
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  existsSync,
  readdirSync,
} from "node:fs"
import { resolve } from "node:path"

import { format, resolveConfig } from "prettier"

import {
  ITEM_SCHEMA,
  OUTPUT_DIR,
  PROVIDED_PACKAGES,
  REGISTRY_JSON,
  REGISTRY_ROOT,
  REGISTRY_SCHEMA,
  importsOf,
  itemUrl,
  packageNameOf,
  readRegistry,
  rewriteAliases,
  withVersion,
  type RegistryItem,
} from "./lib/registry.ts"

const check = process.argv.includes("--check")

/** Formats JSON exactly as `pnpm format` would, so the two never disagree. */
const prettierOptions = await resolveConfig(REGISTRY_JSON)
const formatJson = async (value: unknown, filepath: string): Promise<string> =>
  format(JSON.stringify(value, null, 2), { ...prettierOptions, filepath, parser: "json" })

const registry = readRegistry()

/** source path (`src/ui/button.tsx`) -> the item that ships it. */
const owner = new Map<string, string>()
for (const item of registry.items) {
  for (const file of item.files) {
    const existing = owner.get(file.path)
    if (existing && existing !== item.name) {
      throw new Error(`${file.path} is claimed by both "${existing}" and "${item.name}".`)
    }
    owner.set(file.path, item.name)
  }
}

/** `@registry/ui/button` -> `src/ui/button.tsx`, honouring .ts vs .tsx. */
function resolveInternal(specifier: string): string | null {
  const relative = specifier.replace("@registry/", "src/")
  for (const ext of [".tsx", ".ts", ".css", ""]) {
    const candidate = `${relative}${ext}`
    if (owner.has(candidate)) return candidate
  }
  return null
}

interface Built {
  item: RegistryItem
  json: Record<string, unknown>
}

const built: Built[] = []
const problems: string[] = []

for (const item of registry.items) {
  const npmDeps = new Set<string>()
  const registryDeps = new Set<string>()

  const files = item.files.map((file) => {
    const absolute = resolve(REGISTRY_ROOT, file.path)
    if (!existsSync(absolute)) {
      problems.push(`${item.name}: missing source file ${file.path}`)
      return { ...file, content: "" }
    }
    const raw = readFileSync(absolute, "utf8")

    for (const specifier of importsOf(raw)) {
      if (specifier.startsWith("@registry/")) {
        const target = resolveInternal(specifier)
        if (!target) {
          problems.push(
            `${item.name}: ${file.path} imports ${specifier}, which no item ships`,
          )
          continue
        }
        const ownerName = owner.get(target)!
        if (ownerName !== item.name) registryDeps.add(ownerName)
        continue
      }
      if (specifier.startsWith(".") || specifier.startsWith("@/")) continue
      const pkg = packageNameOf(specifier)
      if (!PROVIDED_PACKAGES.has(pkg)) npmDeps.add(pkg)
    }

    return { ...file, content: rewriteAliases(raw) }
  })

  const dependencies = [...npmDeps].sort().map(withVersion)
  const registryDependencies = [...registryDeps].sort().map(itemUrl)

  const json: Record<string, unknown> = {
    $schema: ITEM_SCHEMA,
    name: item.name,
    type: item.type,
    ...(item.title ? { title: item.title } : {}),
    ...(item.description ? { description: item.description } : {}),
    ...(item.categories ? { categories: item.categories } : {}),
    ...(dependencies.length ? { dependencies } : {}),
    ...(registryDependencies.length ? { registryDependencies } : {}),
    files,
    ...(item.docs ? { docs: item.docs } : {}),
    ...(item.meta ? { meta: item.meta } : {}),
  }

  built.push({ item, json })

  // Keep the checked-in source of truth in step with what was derived.
  if (dependencies.length) item.dependencies = dependencies
  else delete item.dependencies
  if (registryDependencies.length) item.registryDependencies = registryDependencies
  else delete item.registryDependencies
}

if (problems.length) {
  console.error("Registry build failed:\n" + problems.map((p) => `  - ${p}`).join("\n"))
  process.exit(1)
}

const indexJson = {
  $schema: REGISTRY_SCHEMA,
  name: registry.name,
  homepage: registry.homepage,
  items: built.map(({ item, json }) => ({
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    categories: item.categories,
    dependencies: json.dependencies,
    registryDependencies: json.registryDependencies,
    files: item.files.map(({ path, type, target }) => ({ path, type, target })),
  })),
}

const nextRegistryJson = await formatJson(registry, REGISTRY_JSON)

if (check) {
  const current = readFileSync(REGISTRY_JSON, "utf8")
  if (current !== nextRegistryJson) {
    console.error(
      "registry.json is stale — its derived dependencies no longer match the import graph.\n" +
        "Run `pnpm registry:build` and commit the result.",
    )
    process.exit(1)
  }
  const missing = built.filter(
    ({ item }) => !existsSync(resolve(OUTPUT_DIR, `${item.name}.json`)),
  )
  if (missing.length) {
    console.error(
      `Registry output missing for: ${missing.map((m) => m.item.name).join(", ")}`,
    )
    process.exit(1)
  }
  console.log(`registry.json is up to date (${built.length} items).`)
  process.exit(0)
}

writeFileSync(REGISTRY_JSON, nextRegistryJson)

rmSync(OUTPUT_DIR, { recursive: true, force: true })
mkdirSync(OUTPUT_DIR, { recursive: true })
for (const { item, json } of built) {
  writeFileSync(
    resolve(OUTPUT_DIR, `${item.name}.json`),
    JSON.stringify(json, null, 2) + "\n",
  )
}
writeFileSync(
  resolve(OUTPUT_DIR, "index.json"),
  JSON.stringify(indexJson, null, 2) + "\n",
)

const count = readdirSync(OUTPUT_DIR).length
console.log(
  `Built ${built.length} registry items (${count} files) into apps/docs/public/r/`,
)
