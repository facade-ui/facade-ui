/**
 * Each guide has a hand-kept markdown twin in `content/docs`, served to agents
 * as `/docs/<slug>.md`. The two are written by hand, so this pins the one
 * thing that can be checked: they have the same sections.
 */

import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

const GUIDES = ["installation", "theming", "customise", "accessibility"]

const headings = (source: string, pattern: RegExp): string[] =>
  [...source.matchAll(pattern)].map((match) => match[1]!.replace(/&apos;/g, "'").trim())

describe.each(GUIDES)("guide %s", (slug) => {
  it("has the same h2 headings on the page and in its markdown twin", () => {
    const page = readFileSync(
      resolve(import.meta.dirname, `../app/(docs)/docs/${slug}/page.tsx`),
      "utf8",
    )
    const markdown = readFileSync(
      resolve(import.meta.dirname, `../content/docs/${slug}.md`),
      "utf8",
    )
    expect(headings(markdown, /^## (.+)$/gm)).toEqual(
      headings(page, /<h2>([^<]+)<\/h2>/g),
    )
  })
})
