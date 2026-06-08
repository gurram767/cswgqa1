// STEP 1: Import our testing tools.
//  - `test`  -> used to define a test case.
//  - `expect`-> used to check/verify results.
// We import them from OUR fixtures file (not Playwright directly) so we also
// get custom helpers like `loginPage` ready to use inside every test.
import { test, expect } from '../../../src/fixtures/test-fixtures';

// STEP 2: Import the helper that reads our test data from a file.
import { DataReader } from '../../../src/utils/dataReader';

/**
 * REGRESSION tests: broader coverage that runs less often (e.g. nightly).
 *
 * This file also shows DATA-DRIVEN testing: we read a list of invalid logins
 * from a JSON file and generate one test per row. Add a row to the JSON and a
 * new test appears automatically — no extra code needed.
 */

// STEP 3: Describe the SHAPE of one row of login data (a blueprint).
// This tells TypeScript what fields each scenario must have. It must match the
// structure inside src/data/login.data.json.
type InvalidLogin = {
  case: string; // a short label describing the scenario, e.g. "empty username"
  username: string; // the username to type into the form
  password: string; // the password to type into the form
  expectedError: string; // the error message we expect the app to show
};

// STEP 4: Load the data file from disk and store all rows in `data`.
// After this line, `data.invalidLogins` is the LIST of scenarios from the JSON.
const data = DataReader.readJSON<{ invalidLogins: InvalidLogin[] }>('login.data.json');

// STEP 5: Group all related tests under one name (like a folder in the report).
test.describe('Login - Regression', () => {
  // STEP 6: Loop through every scenario in the JSON list.
  // Each pass creates ONE test, so 3 rows in the JSON => 3 separate tests.
  for (const row of data.invalidLogins) {
    // STEP 7: Define one test. Its name includes the scenario label (row.case).
    // `{ loginPage }` asks the framework for a ready-to-use Login page object.
    test(`rejects login: ${row.case} @regression`, async ({ loginPage }) => {
      // STEP 7a: Open the login page in the browser.
      await loginPage.open();

      // STEP 7b: Try to log in using THIS row's username + password.
      // role 'guest' just labels it as a negative/invalid attempt.
      await loginPage.login({ username: row.username, password: row.password, role: 'guest' });

      // STEP 7c: Because the login is invalid, we should stay on the login page.
      // Verify the current URL still contains the word "login".
      expect(loginPage.url()).toContain('login');
    });
  }

  // STEP 8: A separate, normal test (not from the JSON, not in a loop).
  // It also asks for `page` (Playwright's raw browser page) for a direct check.
  test('password field hides the typed value @regression', async ({ loginPage, page }) => {
    // STEP 8a: Open the login page.
    await loginPage.open();

    // STEP 8b: Type a password. The value is hard-coded here because we only
    // care HOW it is displayed, not what the value is.
    await loginPage.enterPassword('Secret123!');

    // STEP 8c: Find the password input box on the page.
    const passwordField = page.locator('input[type="password"]').first();

    // STEP 8d: Verify its type is "password" (this is what shows dots/asterisks
    // instead of the real text, proving the password is masked/hidden).
    await expect(passwordField).toHaveAttribute('type', 'password');
  });
});
