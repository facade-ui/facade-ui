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
}

export default config
