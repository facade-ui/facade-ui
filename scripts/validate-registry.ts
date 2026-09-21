/**
 * Validates the built registry, in two passes.
 *
 * 1. Schema: every emitted `public/r/*.json` is checked against shadcn's own
 *    `registry-item.json` JSON Schema (vendored under `scripts/schema/` so CI
 *    never depends on the network), and the index against `registry.json`.
 *
 * 2. Facade conventions: the rules from the project brief that a JSON Schema
 *    cannot express — no framework imports inside sections, named exports only,
 *    a doc header on every file, kebab-case unprefixed item names, an install
 *    target for every file, and resolvable registry dependencies.
 *
 * Usage: `pnpm registry:validate` (run after `pnpm registry:build`).
 */

import { existsSync, readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"
import { createRequire } from "node:module"

import { Ajv } from "ajv"
import addFormats from "ajv-formats"

import {
  OUTPUT_DIR,
  REGISTRY_ROOT,
  importsOf,
  readRegistry,
  type RegistryItem,
} from "./lib/registry.ts"

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

/**
 * shadcn's schemas declare `$schema: "https://json-schema.org/draft-07/schema#"`.
 * Ajv only registers the meta-schema under the historical `http://` id, so the
 * https spelling has to be aliased in or every compile throws "no schema with
 * key or ref".
 */
const require_ = createRequire(import.meta.url)
const draft7 = JSON.parse(
  readFileSync(require_.resolve("ajv/dist/refs/json-schema-draft-07.json"), "utf8"),
) as Record<string, unknown>
ajv.addMetaSchema({ ...draft7, $id: "https://json-schema.org/draft-07/schema#" })

const schemaDir = resolve(import.meta.dirname, "schema")
const readSchema = (file: string): Record<string, unknown> =>
  JSON.parse(readFileSync(resolve(schemaDir, file), "utf8")) as Record<string, unknown>

// registry.json `$ref`s registry-item.json by URL, so the item schema has to be
// registered under that exact id before the index schema will compile offline.
const itemSchema = readSchema("registry-item.json")
ajv.addSchema(itemSchema, "https://ui.shadcn.com/schema/registry-item.json")

const validateItem = ajv.compile(itemSchema)
const validateRegistry = ajv.compile(readSchema("registry.json"))

const errors: string[] = []
const fail = (message: string): number => errors.push(message)

if (!existsSync(OUTPUT_DIR)) {
  console.error("No registry output. Run `pnpm registry:build` first.")
  process.exit(1)
}

const registry = readRegistry()
const itemNames = new Set(registry.items.map((item) => item.name))

// ---------------------------------------------------------------- pass 1
for (const file of readdirSync(OUTPUT_DIR).filter((f) => f.endsWith(".json"))) {
  const json = JSON.parse(readFileSync(resolve(OUTPUT_DIR, file), "utf8")) as Record<
    string,
    unknown
  >
  const validator = file === "index.json" ? validateRegistry : validateItem
  if (!validator(json)) {
    for (const issue of validator.errors ?? []) {
      fail(`${file}${issue.instancePath} ${issue.message ?? "is invalid"}`)
    }
  }
}

// ---------------------------------------------------------------- pass 2
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Sections must stay framework-neutral; `next/*` belongs in the docs app only. */
const FORBIDDEN_IN_SECTIONS = [/^next\//, /^next$/]

function checkItem(item: RegistryItem): void {
  if (!KEBAB.test(item.name)) fail(`${item.name}: item names are kebab-case`)
  if (item.name.startsWith("facade-")) {
    fail(
      `${item.name}: drop the "facade-" prefix — the registry URL already namespaces items`,
    )
  }

  for (const url of item.registryDependencies ?? []) {
    const name = url
      .split("/")
      .pop()
      ?.replace(/\.json$/, "")
    if (!name || !itemNames.has(name))
      fail(`${item.name}: registry dependency "${url}" resolves to nothing`)
  }

  for (const file of item.files) {
    if (!file.target) fail(`${item.name}: ${file.path} has no install target`)

    const absolute = resolve(REGISTRY_ROOT, file.path)
    if (!existsSync(absolute)) {
      fail(`${item.name}: ${file.path} does not exist`)
      continue
    }
    const source = readFileSync(absolute, "utf8")

    if (file.path.endsWith(".css")) continue

    if (!/^(?:"use client"\n\n)?\/\*\*/.test(source)) {
      fail(
        `${item.path ?? item.name}: ${file.path} needs a JSDoc header (purpose, a11y notes, dependencies)`,
      )
    }
    if (!/\n \* Dependencies:/.test(source)) {
      fail(`${item.name}: ${file.path} header is missing a "Dependencies:" line`)
    }
    if (/^export default /m.test(source)) {
      fail(`${item.name}: ${file.path} uses a default export — named exports only`)
    }

    const isSection =
      file.path.includes("/sections/") || file.path.includes("/templates/")
    if (isSection || file.path.includes("/ui/") || file.path.includes("/motion/")) {
      for (const specifier of importsOf(source)) {
        if (FORBIDDEN_IN_SECTIONS.some((pattern) => pattern.test(specifier))) {
          fail(
            `${item.name}: ${file.path} imports "${specifier}" — sections must stay framework-neutral`,
          )
        }
      }
    }
  }
}

registry.items.forEach(checkItem)

// Every source file under src/ should belong to exactly one item.
const shipped = new Set(registry.items.flatMap((item) => item.files.map((f) => f.path)))
function walk(dir: string, prefix: string): void {
  for (const entry of readdirSync(resolve(REGISTRY_ROOT, dir), { withFileTypes: true })) {
    const rel = `${prefix}/${entry.name}`
    if (entry.isDirectory()) {
      walk(`${dir}/${entry.name}`, rel)
      continue
    }
    if (entry.name === "index.ts" || entry.name.includes(".test.")) continue
    if (!/\.(tsx?|css)$/.test(entry.name)) continue
    if (!shipped.has(rel)) fail(`${rel} is not shipped by any registry item`)
  }
}
walk("src", "src")

if (errors.length) {
  console.error(`Registry validation failed (${errors.length}):`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

console.log(`Registry valid: ${registry.items.length} items, schema + conventions.`)
