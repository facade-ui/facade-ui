/**
 * The parts of the registry model that are safe on the client.
 *
 * Kept apart from `registry.ts` on purpose: that module reads the built registry
 * with `node:fs`, and a client component importing so much as a type from it
 * drags `node:fs` into the browser bundle — which Turbopack rejects outright.
 */

export const REGISTRY_URL = "https://facadeui.dev"

export const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const
export type PackageManager = (typeof PACKAGE_MANAGERS)[number]

/** The command a visitor copies to install an item. */
export function installCommand(name: string, manager: PackageManager = "pnpm"): string {
  const url = `${REGISTRY_URL}/r/${name}.json`
  switch (manager) {
    case "npm":
      return `npx shadcn@latest add ${url}`
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${url}`
    case "yarn":
      return `yarn dlx shadcn@latest add ${url}`
    case "bun":
      return `bunx --bun shadcn@latest add ${url}`
  }
}

/** Pre-renders every manager's command, so the server does the string building. */
export const installCommands = (name: string): Record<PackageManager, string> =>
  Object.fromEntries(PACKAGE_MANAGERS.map((m) => [m, installCommand(name, m)])) as Record<
    PackageManager,
    string
  >
