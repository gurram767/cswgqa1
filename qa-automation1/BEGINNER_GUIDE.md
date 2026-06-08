# Beginner's Guide — Start Here

Welcome! This guide assumes **zero coding or automation experience**. By the end
you'll be able to run tests, watch them in a browser, read the results, and even
change a test yourself. Take it one step at a time. 

---

## 1. What is this, in plain English?

Imagine a robot that opens a web browser, types into boxes, clicks buttons, and
checks that the right things appear on screen — exactly like a human tester, but
fast and tireless.

- **Playwright** is the robot that controls the browser.
- **Our framework** is a tidy set of helpers so you write *short, English-like*
  instructions instead of complicated code.

A test you'll write looks like this:

```ts
test('login page opens', async ({ loginPage }) => {
  await loginPage.open();                  // robot opens the login page
  expect(await loginPage.isLoaded()).toBe(true);  // check it loaded
});
```

That's it. You describe *what* to check; the framework handles *how*.

---

## 2. Words you'll hear (mini dictionary)

| Word            | What it really means                                              |
|-----------------|-------------------------------------------------------------------|
| **Test**        | One check, e.g. "login page opens".                               |
| **Spec file**   | A file ending in `.spec.ts` that holds one or more tests.         |
| **Page Object** | A helper that knows about one screen (e.g. `LoginPage`).          |
| **Locator**     | The "address" of a button/box on the page so the robot can find it. |
| **Selector**    | The text used for that address, e.g. `button:has-text("Login")`.  |
| **Assertion**   | A check using `expect(...)`. If it's false, the test fails.       |
| **Headless**    | Browser runs invisibly (faster). **Headed** = you watch it.       |
| **Suite**       | A group of tests, e.g. *smoke* (quick) or *regression* (full).    |
| **Flaky**       | A test that sometimes passes, sometimes fails — usually timing.   |

Keep this table open during the demo!

---

## 3. One-time setup (do this once)

You need two free tools installed first: **Node.js** (from nodejs.org) and
**VS Code** (the editor). Then open a terminal in the `qa-automation1` folder and run:

```bash
npm install            # downloads the framework's building blocks
npm run install:browsers   # downloads the browsers the robot will drive
```

> Done once. You won't repeat these unless you move to a new computer.

---

## 4. Run your first test (the fun part)

**Watch the robot work** (browser visible, slow enough to see):

```bash
npm run test:smoke -- --headed --project=chromium
```

A Chrome window opens, goes to the login page, and the test passes. 

**Run quietly** (how it normally runs):

```bash
npm run test:smoke
```

You'll see green ticks ✔ in the terminal for each passing test.

---

## 5. See the results report

After any run:

```bash
npm run report:html
```

A web page opens showing every test, green (passed) or red (failed). Click a
test to see details. If a test **fails**, you also get a **screenshot**, a
**video**, and a **trace** (a step-by-step replay) — so you can see exactly what
went wrong without re-running anything.

---

## 6. Anatomy of a test (read this slowly)

Open `tests/ui/demo/first-demo.spec.ts`. Here is the same idea, annotated:

```ts
// 1) Import the tools we need.
import { test, expect } from '../../../src/fixtures/test-fixtures';

// 2) Group related tests with a name.
test.describe('My first demo', () => {

  // 3) A single test: a name + an async function.
  test('the login page shows the Login button @demo', async ({ loginPage }) => {

    // 4) Steps the robot performs (always start with "await").
    await loginPage.open();

    // 5) The check. If this isn't true, the test fails.
    expect(await loginPage.isLoaded()).toBe(true);
  });
});
```

Things to remember:
- Every robot action starts with **`await`** (it means "wait for this to finish").
- **`loginPage`** is handed to you automatically — you don't create it.
- **`expect(...)`** is your check. No `expect`, no real test.
- **`@demo`** in the title is a **tag** so you can run just these tests.

---

## 7. Your turn — change something (guided exercise)

1. Open `tests/ui/demo/first-demo.spec.ts`.
2. Find the second test that types a username.
3. Change the username text to your name, save the file.
4. Re-run: `npm run test:demo -- --headed`.
5. Watch the browser type your name into the box. You just edited a test! 🎉

Nothing here can break the app — tests only *read and click*, they don't change
real data when you use a test account.

---

## 8. Where things live (so you know what to open)

| I want to...                          | Open this                                   |
|---------------------------------------|---------------------------------------------|
| Change what a test checks             | a file in `tests/ui/...`                    |
| Fix a button/box "address" (selector) | `src/pages/locators/*.locators.ts`          |
| Add an action to a screen             | the matching file in `src/pages/`           |
| Change the website URL or timeouts    | `config/env/.env.qa`                        |
| See all the run commands              | `package.json` (the "scripts" section)      |

**Golden rule:** if a selector breaks, you fix it in **one** locator file — never
in every test.

---

## 9. Command cheat sheet

```bash
npm run test:smoke         # quick critical tests
npm run test:regression    # the full set
npm run test:chrome        # only Chrome
npm test -- --headed       # watch any run in a visible browser
npm run report:html        # open the results report
```

Tip: add `-- --headed` to any command to watch it live.

---

## 10. Troubleshooting (don't panic)

| You see...                                 | Do this                                            |
|--------------------------------------------|----------------------------------------------------|
| `command not found: npm`                   | Install Node.js, then reopen the terminal.         |
| `browserType.launch ... not found`         | Run `npm run install:browsers`.                    |
| A test fails on a selector                 | Open the report → screenshot. Fix the selector in the locator file. |
| It can't reach the website                 | Check you're on the right network/VPN.             |
| A test is "flaky" (passes then fails)      | Re-run once. If it keeps happening, tell the team — it's a real issue. |

---

## 11. You're ready 

You can now: install, run, watch, read reports, and tweak a test. That's the
core of the job. Everything else (new pages, new tests) follows the same simple
pattern: **open a screen → do actions → check with `expect`**.

When you're comfortable here, read the main `README.md` for the deeper details.
Happy testing! 🌟
