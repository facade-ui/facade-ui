import { next } from "@facade-ui/eslint-config/next"

export default [
  ...next,
  {
    // The docs app is a Next.js app: pages, layouts and route handlers must be
    // default exports.
    files: ["app/**/*.tsx", "app/**/*.ts", "next.config.ts", "postcss.config.mjs"],
    rules: { "no-restricted-exports": "off" },
  },
]
