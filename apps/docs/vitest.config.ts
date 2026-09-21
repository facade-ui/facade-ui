import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      "@registry": fileURLToPath(new URL("../../packages/registry/src", import.meta.url)),
      "@scripts": fileURLToPath(new URL("../../scripts/lib", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["lib/**/*.test.ts"],
  },
})
