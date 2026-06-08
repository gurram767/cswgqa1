import { defineConfig, devices } from '@playwright/test';
import { env } from './config/environment';

/**
 * Central Playwright runner configuration.
 * All values are config/env-driven — nothing environment-specific is hard-coded.
 * See config/environment.ts for how TEST_ENV selects the active environment.
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './reports/test-results',

  // Parallelism
  fullyParallel: true,
  workers: env.workers,
  retries: env.retries,

  // Fail the build on CI if test.only is left in the source.
  forbidOnly: env.isCI,

  // Global timeouts
  timeout: env.testTimeout,
  expect: { timeout: env.expectTimeout },

  // Reporting: console list + Playwright HTML + Allure + JUnit (for Jenkins).
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
    ['allure-playwright', { resultsDir: 'reports/allure-results', detail: true }],
  ],

  use: {
    baseURL: env.baseURL,
    actionTimeout: env.actionTimeout,
    navigationTimeout: env.navigationTimeout,
    headless: env.headless,
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,

    // Diagnostics on failure only — keeps artifacts small at scale.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // ---- UI projects: cross-browser ----
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testDir: './tests/ui',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'edge',
      testDir: './tests/ui',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
});
