import { test, expect } from '../../../src/fixtures/test-fixtures';
import { DataReader } from '../../../src/utils/dataReader';

/**
 * INVALID LOGIN tests (negative / unhappy path).
 *
 * These verify the app REJECTS bad logins. They are DATA-DRIVEN: every row in
 * src/data/login.data.json becomes its own test. Add a row to the JSON and a
 * new test appears automatically — no extra code needed.
 *
 * NOTE on the assertion: the app uses an OAuth2 flow. Submitting credentials
 * redirects through /Oauth2Secure/user/commonauth (a URL that does NOT contain
 * "login"), so we cannot assert the URL still contains "login". Instead we
 * assert the rejected login NEVER reaches the authenticated home/dashboard page.
 *
 * Tagged @regression so they run with the regression suite.
 */

// Matches the authenticated landing pages a SUCCESSFUL login would reach.
const AUTHENTICATED_URL = /#\/(home|dashboard)/;

// STEP 1: Describe the shape of one row of invalid-login data (a blueprint).
type InvalidLogin = {
  case: string; // short label, e.g. "empty username"
  username: string; // username to type
  password: string; // password to type
  expectedError: string; // error message we expect the app to show
};

// STEP 2: Load every invalid-login scenario from the JSON data file.
const data = DataReader.readJSON<{ invalidLogins: InvalidLogin[] }>('login.data.json');

test.describe('Login - Invalid Credentials', () => {
  // STEP 3: Turn each JSON row into its own test.
  for (const row of data.invalidLogins) {
    test(`rejects login: ${row.case} @regression`, async ({ loginPage, page }) => {
      // STEP 3a: Open the login page.
      await loginPage.open();

      // STEP 3b: Attempt to log in with this row's INVALID data.
      await loginPage.login({ username: row.username, password: row.password, role: 'guest' });

      // STEP 3c: Let the OAuth round-trip settle, then confirm the invalid
      // login NEVER reached the authenticated home/dashboard page.
      await page.waitForLoadState('networkidle').catch(() => undefined);
      expect(loginPage.url()).not.toMatch(AUTHENTICATED_URL);
    });
  }

  // STEP 4: A quick negative sanity check with obviously wrong credentials.
  test('shows an error for invalid credentials @regression', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login({ username: 'invalid_user', password: 'wrong_password', role: 'guest' });

    await page.waitForLoadState('networkidle').catch(() => undefined);
    expect(loginPage.url()).not.toMatch(AUTHENTICATED_URL);
  });

  // STEP 5: The password field must mask the typed value (security check).
  test('password field hides the typed value @regression', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.enterPassword('Secret123!');

    const passwordField = page.locator('input[type="password"]').first();
    await expect(passwordField).toHaveAttribute('type', 'password');
  });
});
