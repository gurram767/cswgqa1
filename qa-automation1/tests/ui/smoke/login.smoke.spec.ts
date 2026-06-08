import { test, expect } from '../../../src/fixtures/test-fixtures';
import { Users } from '../../../src/data/users';

/**
 * SMOKE tests: a few quick, critical checks for the VALID (happy-path) login.
 * If these fail, the build is broken.
 *
 * Real credentials are NEVER hard-coded. They come from the credential registry
 * (src/data/users.ts), which reads them from environment variables:
 *   - locally:  set ADMIN_USERNAME / ADMIN_PASSWORD in config/env/.env.local
 *   - in CI:    set them as repository secrets (Settings > Secrets > Actions)
 *
 * Run only smoke tests with:  npm run test:smoke  (playwright test --grep @smoke)
 */
test.describe('Login - Smoke (valid credentials)', () => {
  test('login page loads with all key fields @smoke @sanity', async ({ loginPage }) => {
    // STEP 1: Open the login page.
    await loginPage.open();

    // STEP 2: The page is considered loaded when the Login button is visible.
    expect(await loginPage.isLoaded()).toBe(true);
  });

  test('logs in successfully with valid admin credentials @smoke', async ({
    loginPage,
    dashboardPage,
  }) => {
    // STEP 1: Pull the valid admin credentials from the registry (env-backed).
    const admin = Users.admin();

    // STEP 2: Open the login page.
    await loginPage.open();

    // STEP 3: Log in with the VALID username + password.
    await loginPage.login(admin);

    // STEP 4: A successful login should land us on the dashboard.
    expect(await dashboardPage.isLoaded()).toBe(true);
  });
});
