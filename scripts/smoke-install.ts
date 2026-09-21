/**
 * Proves the registry actually installs into a real project.
 *
 * Everything else in CI tests the registry from the inside. This does the thing
 * a user does: scaffolds `create-next-app`, runs `shadcn init`, serves the built
 * registry over HTTP, installs every item through the shadcn CLI, and then
 * typechecks the result. It is the only check that can catch a wrong install
 * `target`, an alias that rewrites to a path the CLI does not create, or a
 * dependency the CLI cannot resolve.
 *
 * Usage:
 *   pnpm exec tsx scripts/smoke-install.ts            # all items
 *   pnpm exec tsx scripts/smoke-install.ts button     # just these
 *   KEEP_SMOKE_DIR=1 pnpm exec tsx scripts/smoke-install.ts
 */

import { spawn } from "node:child_process"
import { createServer } from "node:http"
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

import { OUTPUT_DIR, REGISTRY_BASE_URL, readRegistry } from "./lib/registry.ts"

const only = process.argv.slice(2).filter((arg) => !arg.startsWith("-"))
const keepDir = process.env.KEEP_SMOKE_DIR === "1"

if (!existsSync(join(OUTPUT_DIR, "index.json"))) {
  console.error("No registry output. Run `pnpm registry:build` first.")
  process.exit(1)
}

/**
 * Serves `public/r/` so the shadcn CLI can fetch items by URL, offline.
 *
 * `registryDependencies` in the built items point at the production base URL,
 * which is correct for what ships and useless for a test with no network. Each
 * response is rewritten to point back at this server, so the CLI resolves the
 * whole dependency graph locally against the exact bytes that would be
 * published.
 */
function serveRegistry(): Promise<{ port: number; close: () => Promise<void> }> {
  const server = createServer((request, response) => {
    const name = (request.url ?? "/").replace(/^\/+/, "").split("?")[0] ?? ""
    const file = join(OUTPUT_DIR, name)
    if (!name.endsWith(".json") || !existsSync(file)) {
      response.writeHead(404).end("not found")
      return
    }
    const address = server.address()
    const port = typeof address === "object" && address ? address.port : 0
    const body = readFileSync(file, "utf8").replaceAll(
      `${REGISTRY_BASE_URL}/`,
      `http://127.0.0.1:${port}/`,
    )
    response.writeHead(200, { "content-type": "application/json" })
    response.end(body)
  })

  return new Promise((resolveReady) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address()
      const port = typeof address === "object" && address ? address.port : 0
      resolveReady({
        port,
        close: () => new Promise<void>((done) => server.close(() => done())),
      })
    })
  })
}

/**
 * Asynchronous on purpose. `spawnSync` blocks the event loop, which starves the
 * registry server above — the shadcn CLI then fails with a headers timeout
 * fetching a file that is sitting right there on disk.
 */
function run(command: string, args: string[], cwd: string, label: string): Promise<void> {
  console.log(`\n$ ${command} ${args.join(" ")}`)
  return new Promise((done, fail) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      env: { ...process.env, CI: "1", NEXT_TELEMETRY_DISABLED: "1", ADBLOCK: "1" },
    })
    child.on("error", fail)
    child.on("close", (code) => {
      if (code === 0) done()
      else fail(new Error(`${label} failed with exit code ${code ?? "unknown"}`))
    })
  })
}

const registry = readRegistry()
const items = registry.items
  .map((item) => item.name)
  .filter((name) => only.length === 0 || only.includes(name))

const workspace = mkdtempSync(join(tmpdir(), "facade-smoke-"))
const project = join(workspace, "consumer")

async function main(): Promise<void> {
  const { port, close } = await serveRegistry()
  console.log(`Serving the registry on http://127.0.0.1:${port}`)

  try {
    await run(
      "npx",
      [
        "--yes",
        "create-next-app@latest",
        "consumer",
        "--typescript",
        "--tailwind",
        "--eslint",
        "--app",
        "--no-src-dir",
        "--import-alias",
        "@/*",
        "--use-npm",
        "--yes",
      ],
      workspace,
      "create-next-app",
    )

    await run(
      "npx",
      ["--yes", "shadcn@latest", "init", "--defaults", "--yes"],
      project,
      "shadcn init",
    )

    for (const name of items) {
      await run(
        "npx",
        [
          "--yes",
          "shadcn@latest",
          "add",
          `http://127.0.0.1:${port}/${name}.json`,
          "--yes",
          "--overwrite",
        ],
        project,
        `shadcn add ${name}`,
      )
    }

    // The registry ships strict TypeScript; a consumer project must compile it.
    await run("npx", ["--yes", "tsc", "--noEmit"], project, "tsc")

    console.log(`\nSmoke test passed: ${items.length} items installed and typechecked.`)
  } finally {
    await close()
    if (keepDir) console.log(`Project kept at ${project}`)
    else rmSync(workspace, { recursive: true, force: true })
  }
}

main().catch((error: unknown) => {
  console.error(
    `\nSmoke test failed: ${error instanceof Error ? error.message : String(error)}`,
  )
  if (keepDir) console.error(`Project kept at ${project}`)
  else rmSync(workspace, { recursive: true, force: true })
  process.exit(1)
})
