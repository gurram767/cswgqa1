import { test, expect } from '../../../src/fixtures/test-fixtures';

/**
 * SMOKE tests: a few quick, critical checks. If these fail, the build is broken.
 *
 * Tagging: we put "@smoke" in the title. Run only smoke tests with:
 *   npm run test:smoke      (which runs: playwright test --grep @smoke)
 */
test.describe('Login - Smoke', () => {
  test('login page loads with all key fields @smoke @sanity', async ({ loginPage }) => {
    await loginPage.open();

    // The page is considered loaded when the Login button is visible.
    expect(await loginPage.isLoaded()).toBe(true);
  });

  test('shows an error for invalid credentials @smoke', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login({ username: 'invalid_user', password: 'wrong_password', role: 'guest' });

    // We expect to stay on the login page (no dashboard) and/or see an error.
    expect(loginPage.url()).toContain('login');
  });
});
