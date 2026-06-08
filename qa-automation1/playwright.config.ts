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

    // Capture diagnostics for EVERY test (pass or fail) so the HTML and Allure
    // reports always include a screenshot/trace for both valid and invalid tests.
    trace: 'on',
    screenshot: 'on',
    video: 'on',
  },

  projects: [
    // ---- UI projects: Chrome + Edge only ----
    {
      name: 'chromium',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'edge',
      testDir: './tests/ui',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
  ],
});
