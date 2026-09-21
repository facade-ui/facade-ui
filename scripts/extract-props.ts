/**
 * Extracts props tables for the docs site straight from the registry source.
 *
 * Hand-written props tables rot the moment a prop is renamed, and a docs site
 * that lies about its own API is worse than one with no table at all. This walks
 * the TypeScript AST instead: every exported `*Props` interface becomes a table,
 * each member keeps its JSDoc as the description, and default values are read
 * from the component's own destructuring pattern — so `size = "md"` in the code
 * is what the docs show.
 *
 * Output: `apps/docs/.generated/props.json`, keyed by registry item name. The
 * shapes live in `lib/props-types.ts` so the docs app can import them freely.
 *
 * Usage: `pnpm docs:props` (run by the docs build before `next build`).
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

import ts from "typescript"

import { REGISTRY_ROOT, REPO_ROOT, readRegistry, rewriteAliases } from "./lib/registry.ts"
import type { FileDoc, InterfaceDoc, PropDoc } from "./lib/props-types.ts"

const OUTPUT = resolve(REPO_ROOT, "apps/docs/.generated/props.json")

/** Collapses a multi-line type annotation into one readable line. */
const typeText = (node: ts.TypeNode | undefined, source: ts.SourceFile): string =>
  node
    ? node
        .getText(source)
        .replace(/\s*\n\s*/g, " ")
        .trim()
    : "unknown"

function jsDocOf(node: ts.Node): string | undefined {
  const docs = (node as { jsDoc?: ts.JSDoc[] }).jsDoc
  if (!docs?.length) return undefined
  const text = docs
    .map((doc) =>
      typeof doc.comment === "string"
        ? doc.comment
        : ts.getTextOfJSDocComment(doc.comment),
    )
    .filter(Boolean)
    .join("\n")
    .trim()
  return text || undefined
}

/** `{ size = "md", align = "start" }` -> `{ size: '"md"', align: '"start"' }`. */
function defaultsOf(source: ts.SourceFile): Map<string, Map<string, string>> {
  const byComponent = new Map<string, Map<string, string>>()

  source.forEachChild((node) => {
    if (!ts.isFunctionDeclaration(node) || !node.name) return
    const [parameter] = node.parameters
    if (!parameter || !ts.isObjectBindingPattern(parameter.name)) return

    const defaults = new Map<string, string>()
    for (const element of parameter.name.elements) {
      if (!element.initializer) continue
      const key = element.propertyName ?? element.name
      if (!ts.isIdentifier(key)) continue
      defaults.set(
        key.text,
        element.initializer.getText(source).replace(/\s*\n\s*/g, " "),
      )
    }
    if (defaults.size) byComponent.set(node.name.text, defaults)
  })

  return byComponent
}

/** Pulls `name?: type` members out of a type literal, with JSDoc and defaults. */
function membersOf(
  members: ts.NodeArray<ts.TypeElement>,
  source: ts.SourceFile,
  defaults: Map<string, string>,
): PropDoc[] {
  return members.flatMap((member) => {
    if (!ts.isPropertySignature(member) || !member.name) return []
    const name =
      ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)
        ? member.name.text
        : member.name.getText(source)

    return [
      {
        name,
        type: rewriteAliases(typeText(member.type, source)),
        required: member.questionToken === undefined,
        ...(jsDocOf(member) ? { description: jsDocOf(member) } : {}),
        ...(defaults.has(name) ? { defaultValue: defaults.get(name) } : {}),
      },
    ]
  })
}

function documentFile(absolutePath: string, relativePath: string): FileDoc {
  const raw = readFileSync(absolutePath, "utf8")
  const source = ts.createSourceFile(
    relativePath,
    raw,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  )
  const componentDefaults = defaultsOf(source)
  const interfaces: InterfaceDoc[] = []

  source.forEachChild((node) => {
    if (!ts.isInterfaceDeclaration(node)) return
    const exported = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    if (!exported || !node.name.text.endsWith("Props")) return

    // `ButtonProps` <- defaults from `function Button(...)`.
    const defaults =
      componentDefaults.get(node.name.text.replace(/Props$/, "")) ?? new Map()

    const props = membersOf(node.members, source, defaults)

    interfaces.push({
      name: node.name.text,
      ...(jsDocOf(node) ? { description: jsDocOf(node) } : {}),
      extends:
        node.heritageClauses?.flatMap((clause) =>
          clause.types.map((type) => rewriteAliases(type.getText(source))),
        ) ?? [],
      props,
    })
  })

  // `export type ButtonProps = BaseButtonProps & ButtonVariantProps & { … }`.
  // Intersections are as common as interfaces here, and a props table that
  // silently omitted Button would be worse than no table at all.
  source.forEachChild((node) => {
    if (!ts.isTypeAliasDeclaration(node)) return
    const exported = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    if (!exported || !node.name.text.endsWith("Props")) return

    const defaults =
      componentDefaults.get(node.name.text.replace(/Props$/, "")) ?? new Map()
    const parts = ts.isIntersectionTypeNode(node.type)
      ? [...node.type.types]
      : [node.type]

    const props: PropDoc[] = []
    const inherits: string[] = []
    for (const part of parts) {
      if (ts.isTypeLiteralNode(part))
        props.push(...membersOf(part.members, source, defaults))
      else inherits.push(rewriteAliases(typeText(part, source)))
    }

    if (!props.length && !inherits.length) return
    interfaces.push({
      name: node.name.text,
      ...(jsDocOf(node) ? { description: jsDocOf(node) } : {}),
      extends: inherits,
      props,
    })
  })

  return { path: relativePath, interfaces }
}

const registry = readRegistry()
const docs: Record<string, FileDoc[]> = {}

for (const item of registry.items) {
  const files = item.files
    .filter((file) => /\.tsx?$/.test(file.path))
    .map((file) => documentFile(resolve(REGISTRY_ROOT, file.path), file.path))
    .filter((file) => file.interfaces.length > 0)

  if (files.length) docs[item.name] = files
}

mkdirSync(resolve(OUTPUT, ".."), { recursive: true })
writeFileSync(OUTPUT, JSON.stringify(docs, null, 2) + "\n")

const total = Object.values(docs).reduce(
  (sum, files) => sum + files.reduce((n, f) => n + f.interfaces.length, 0),
  0,
)
console.log(`Extracted ${total} props tables for ${Object.keys(docs).length} items.`)
