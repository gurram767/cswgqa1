import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

/**
 * Custom test fixtures.
 *
 * Playwright lets us pre-build helpers and "inject" them into each test.
 * Instead of writing `const loginPage = new LoginPage(page)` in every test,
 * a test just asks for what it needs:
 *
 *   test('example', async ({ loginPage, dashboardPage }) => { ... });
 *
 * Everything below is created fresh for each test (so tests stay isolated).
 */
type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
});

// Re-export our custom expect (built-in matchers + our extra ones).
export { expect } from '../utils/customAssertions';
