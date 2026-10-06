/**
 * Tells search engines that support IndexNow (Bing, Yandex, Seznam, Naver)
 * about every page in the live sitemap, so new pages are crawled in days, not
 * weeks. Run after a deploy that adds or renames pages: `pnpm indexnow`.
 *
 * The key file `apps/docs/public/<key>.txt` proves the site owns the key.
 */

import { readdirSync } from "node:fs"
import { resolve } from "node:path"

import { REGISTRY_HOMEPAGE, REPO_ROOT } from "./lib/registry.ts"

const PUBLIC = resolve(REPO_ROOT, "apps/docs/public")
const keyFile = readdirSync(PUBLIC).find((file) => /^[0-9a-f]{32}\.txt$/.test(file))
if (!keyFile) {
  console.error("No IndexNow key file in apps/docs/public.")
  process.exit(1)
}
const key = keyFile.replace(/\.txt$/, "")
const host = new URL(REGISTRY_HOMEPAGE).host

const sitemap = await (await fetch(`${REGISTRY_HOMEPAGE}/sitemap.xml`)).text()
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]!)
const extra = ["/llms.txt", "/llms-full.txt"].map((path) => `${REGISTRY_HOMEPAGE}${path}`)

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `${REGISTRY_HOMEPAGE}/${keyFile}`,
    urlList: [...urlList, ...extra],
  }),
})

console.log(`IndexNow: ${response.status} for ${urlList.length + extra.length} URLs.`)
if (!response.ok && response.status !== 202) process.exit(1)
