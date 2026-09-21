import { react19 } from "./react.js"

/** Next.js docs app config: same React/a11y bar, but default exports are allowed. */
export const next = [
  ...react19,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
]

export default next
