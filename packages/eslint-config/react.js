import globals from "globals"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import jsxA11y from "eslint-plugin-jsx-a11y"
import { base } from "./base.js"

/**
 * React + a11y flat config for the registry package.
 * jsx-a11y runs in `strict` mode: Facade UI targets WCAG 2.2 AA.
 */
export const react19 = [
  ...base,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: "19.0" } },
    plugins: { react, "react-hooks": reactHooks, "jsx-a11y": jsxA11y },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.strict.rules,
      "react/prop-types": "off",
      "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
      "react/self-closing-comp": "error",
    },
  },
  {
    // Tests assert on structure the components guarantee, so a non-null
    // assertion after a query is a statement of intent rather than a risk. They
    // also render deliberately incorrect markup to pin upstream behaviour.
    files: ["**/*.test.{ts,tsx}", "**/vitest.setup.ts"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "jsx-a11y/anchor-has-content": "off",
      "jsx-a11y/anchor-is-valid": "off",
    },
  },
]

export default react19
