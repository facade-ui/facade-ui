import js from "@eslint/js"
import tseslint from "typescript-eslint"
import prettier from "eslint-config-prettier"

/** Shared flat config: strict typescript-eslint, no type-aware linting by default. */
export const base = tseslint.config(
  { ignores: ["**/dist/**", "**/.next/**", "**/.turbo/**", "**/coverage/**", "**/public/r/**"] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "react",
              importNames: ["default"],
              message: "Use named imports from react (`import { useState } from 'react'`).",
            },
          ],
        },
      ],
    },
  },
  prettier,
)

export default base
