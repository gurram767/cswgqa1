// ===========================================================================
//  YOUR FIRST DEMO TEST  (read top to bottom — every line is explained)
//
//  Run it and WATCH it in a browser:
//      npm run test:demo -- --headed
//
//  Run it quietly:
//      npm run test:demo
// ===========================================================================

// STEP 1: Bring in the tools.
//  - "test"  = lets us define a test.
//  - "expect" = lets us check things ("assert").
// These come from our framework, which also hands us ready-made page helpers.
import { test, expect } from '../../../src/fixtures/test-fixtures';

// STEP 2: Group related tests under one friendly name.
// The "@demo" tag in each title lets us run ONLY these tests with --grep @demo.
test.describe('First demo - getting comfortable', () => {
  // -------------------------------------------------------------------------
  // TEST 1: Check the login page opens and shows the Login button.
  // -------------------------------------------------------------------------
  test('login page opens and shows the Login button @demo @smoke', async ({ loginPage }) => {
    // "loginPage" is given to us automatically — we did not have to build it.

    // ACTION: open the login page. ("await" = wait until it's done.)
    await loginPage.open();

    // CHECK: the page loaded (the Login button is visible).
    // If this is not true, the test fails and we get a screenshot + video.
    expect(await loginPage.isLoaded()).toBe(true);
  });

  // -------------------------------------------------------------------------
  // TEST 2: Type into the username box.
  //  >>> TRY THIS: change the text below to your name, save, and re-run with
  //      "--headed" to watch the browser type it. You just edited a test!
  // -------------------------------------------------------------------------
  test('we can type a username into the box @demo', async ({ loginPage }) => {
    await loginPage.open();

    // ACTION: type some text into the username field.
    await loginPage.enterUsername('demo_user'); // <-- change me and re-run!

    // CHECK: we are still on the login page (we did not click Login yet).
    expect(loginPage.url()).toContain('login');
  });
});
