/**
 * End-to-end gate for the registry.
 *
 * Tests hit the standalone preview routes (`/preview/<item>`) rather than the
 * docs pages around them. That keeps each run scoped to the component under test
 * — an axe violation in the docs chrome cannot mask or manufacture one in a
 * section, and a visual snapshot cannot churn because the sidebar grew an entry.
 */

import { defineConfig, devices } from "@playwright/test"

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 4319)
const baseURL = `http://127.0.0.1:${PORT}`

export default defineConfig({
  testDir: "./e2e",
  /**
   * Snapshots are namespaced by platform. Font rasterisation differs between
   * macOS and the Linux CI container, so one shared baseline could never pass on
   * both; keeping them side by side lets contributors run the suite locally
   * while CI compares against its own.
   */
  snapshotPathTemplate: "e2e/__screenshots__/{platform}/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  timeout: 45_000,
  expect: {
    // Sub-pixel text rendering differs between machines; a small ratio keeps
    // snapshots meaningful without making them a source of flaky failures.
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" },
  },
  use: {
    baseURL,
    trace: "on-first-retry",
    colorScheme: "light",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm --filter @facade-ui/docs exec next start --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
