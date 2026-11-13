import type { NextConfig } from "next"

const config: NextConfig = {
  reactStrictMode: true,
  // The registry ships TypeScript source, not a build artefact — that is the
  // product. Next has to compile it like first-party code.
  transpilePackages: ["@facade-ui/registry"],
  typedRoutes: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Agents guess these paths for an item's page; send them to the real one.
  // `:name` keeps a `.md` suffix, so the markdown twins redirect too.
  async redirects() {
    return ["/sections", "/docs/sections", "/docs/components"].map((from) => ({
      source: `${from}/:name`,
      destination: "/components/:name",
      permanent: true,
    }))
  },
}

export default config
