# CSW Connect — Playwright Automation Framework

A clean, **beginner-friendly** but enterprise-ready **web UI** test automation
framework built with **Playwright + TypeScript**. It runs across **Chrome,
Firefox, and Edge**, works in **multiple environments** (qa/prod), and
runs anywhere with **Docker** — so you don't need to install browsers on your
own machine.

> New to automation? Read the sections in order. Every file in this project has
> comments explaining what it does and why.

---

## 1. Quick start (3 steps)

```bash
# 1. Install dependencies
npm install

# 2. Install the browsers (only needed when running locally, not in Docker)
npm run install:browsers

# 3. Run the smoke tests
npm run test:smoke
```

To run tests **without installing anything except Docker**:

```bash
npm run docker:build
npm run docker:test
```

---

## 2. How it works (the big picture)

A test should read like plain English. Here is a real test from this project:

```ts
test('login page loads @smoke', async ({ loginPage }) => {
  await loginPage.open();
  expect(await loginPage.isLoaded()).toBe(true);
});
```

The test does **not** know about CSS selectors or URLs. All of that lives in
reusable pieces:

| Piece            | What it does                                  | Example file                         |
|------------------|-----------------------------------------------|--------------------------------------|
| **Page Object**  | Actions for one screen (open, login, ...)     | `src/pages/LoginPage.ts`             |
| **Locators**     | All the selectors for that screen, in one place | `src/pages/locators/login.locators.ts` |
| **Fixtures**     | Hand ready-made page objects to each test     | `src/fixtures/test-fixtures.ts`      |
| **Config**       | URLs, timeouts, which environment             | `config/`                            |
| **Utilities**    | Logger, waits, retries, self-healing          | `src/utils/`                         |
| **Data**         | Test data + role-based users                  | `src/data/`                          |

When the UI changes, you fix **one selector file** — not every test.

---

## 3. Folder structure (and what each folder is for)

```
qa-automation1/
├── config/                      # Configuration (no test logic here)
│   ├── env/                     #   One .env file per environment
│   │   ├── .env.qa              #     QA settings (URLs, timeouts)
│   │   ├── .env.prod            #     PROD settings
│   │   └── .env.example         #     Template to copy from
│   ├── environment.ts           #   Loads the right .env and gives typed config
│   └── endpoints.ts             #   All app routes + API endpoints in one place
│
├── src/
│   ├── core/                    # Shared base classes
│   │   └── BasePage.ts          #   Parent of every Page Object (common helpers)
│   ├── pages/                   # Page Objects (one file per screen)
│   │   ├── LoginPage.ts
│   │   ├── DashboardPage.ts
│   │   └── locators/            #   Centralized selectors for each page
│   │       ├── login.locators.ts
│   │       └── dashboard.locators.ts
│   ├── fixtures/
│   │   └── test-fixtures.ts     #   Injects page objects into each test
│   ├── utils/                   # Reusable helpers
│   │   ├── logger.ts            #   Leveled logging (no extra dependencies)
│   │   ├── waitHelper.ts        #   Readable explicit waits
│   │   ├── retryHelper.ts       #   Retry flaky async actions (with backoff)
│   │   ├── customAssertions.ts  #   Extra expect() matchers (toBeReady, ...)
│   │   ├── selfHealingLocator.ts#   Tries backup selectors if the main one breaks
│   │   ├── authHelper.ts        #   loginAs(page, 'admin') one-liner
│   │   └── dataReader.ts        #   Loads JSON test data
│   ├── data/                    # Test data
│   │   ├── users.ts             #   Role-based users (values from secrets)
│   │   └── login.data.json      #   Data-driven login cases
│   └── types/
│       └── index.ts             #   Shared TypeScript types
│
├── tests/                       # The actual tests
│   └── ui/
│       ├── smoke/               #   Fast critical checks  (@smoke)
│       └── regression/          #   Broader coverage      (@regression)
│
├── reports/                     # Generated reports (gitignored)
├── Dockerfile                   # Builds the test image (browsers included)
├── docker-compose.yml           # One-command Docker runs
├── Jenkinsfile                  # Jenkins pipeline
├── playwright.config.ts         # Playwright settings (projects, reporters...)
├── tsconfig.json                # TypeScript settings
└── package.json                 # Dependencies + npm scripts
```

A matching **GitHub Actions** workflow lives at the repo root:
`.github/workflows/qa-automation1.yml`.

---

## 4. Choosing an environment

Set `TEST_ENV` to pick which `config/env/.env.*` file is used (`qa` or `prod`,
default: `qa`):

```bash
TEST_ENV=prod npm test          # macOS/Linux
$env:TEST_ENV="prod"; npm test  # Windows PowerShell
```

`config/environment.ts` loads, in order: the env file → `.env.local`
(gitignored) → real environment variables (CI secrets win).

---

## 5. Credentials (kept safe)

Passwords are **never** written in the code. Provide them as environment
variables. For local runs, create `config/env/.env.local` (gitignored):

```env
ADMIN_USERNAME=your_admin
ADMIN_PASSWORD=your_password
STORE_USERNAME=your_store_user
STORE_PASSWORD=your_password
```

In CI, add the same names as **secrets**. `src/data/users.ts` reads them and
fails with a clear message if one is missing.

---

## 6. Running tests

```bash
npm test                  # everything
npm run test:smoke        # only @smoke tests
npm run test:regression   # only @regression tests
npm run test:sanity       # only @sanity tests
npm run test:ui           # all UI tests

npm run test:chrome       # Chromium only
npm run test:firefox      # Firefox only
npm run test:edge         # Edge only

npm run test:headed       # watch the browser
npm run test:debug        # step through with the Playwright Inspector
npm run test:parallel     # run with 4 workers
```

**Test tags** are just text in the test title (e.g. `@smoke`, `@regression`,
`@sanity`). The `--grep` flag runs only matching tests.

---

## 7. Reports

After a run:

```bash
npm run report:html       # open the Playwright HTML report
npm run report:allure     # build + open the Allure report
```

- **HTML report** → `reports/html-report/`
- **Allure results** → `reports/allure-results/`
- **JUnit XML** (for Jenkins) → `reports/junit/`
- **Screenshots / videos / traces** are captured automatically **on failure**
  and attached to the report. Open a trace with `npx playwright show-trace`.

---

## 8. Running in Docker (no local browsers needed)

```bash
docker compose run --rm tests            # run inside the container
TEST_ENV=prod docker compose run --rm tests
docker compose run --rm tests-host       # for internal/VPN apps (see note)
```

> For internal/VPN-only sites, use the `tests-host` service and enable host
> networking in Docker Desktop: *Settings > Resources > Network*.

You can also run a specific suite in Docker:

```bash
docker compose run --rm tests npx playwright test --grep @smoke
```

---

## 9. CI/CD

- **GitHub Actions:** `.github/workflows/qa-automation1.yml` runs on push/PR,
  on a nightly schedule, and via a manual "Run workflow" button (pick suite +
  environment). Add `ADMIN_USERNAME`, `ADMIN_PASSWORD`, etc. as repo secrets.
- **Jenkins:** `Jenkinsfile` runs the suite inside the Playwright Docker image.
  Create the credential IDs it references, then point a Jenkins job at it.

---

## 10. Coding standards

- **SOLID & small pieces:** each class has one job (a page, a helper).
  Shared behavior lives in `BasePage`.
- **No duplication:** selectors live in `locators/`, URLs in `endpoints.ts`,
  config in `config/`. Change things in one place.
- **Always `async/await`:** every Playwright call returns a Promise — always
  `await` it. (Tip: run `npm run lint` to catch mistakes.)
- **Readable tests:** tests describe *what*, page objects handle *how*.

---

## 11. Best practices for maintaining 500+ tests

1. **One Page Object per screen; one locator file per screen.** This is what
   keeps maintenance cheap as the suite grows.
2. **Prefer stable selectors** (`data-testid`, roles, labels) over brittle CSS
   chains. Add backups via the self-healing locator, but fix the primary when a
   heal is logged.
3. **Tag everything** (`@smoke`, `@sanity`, `@regression`). Run `@smoke` on every
   PR (fast feedback) and the full suite nightly.
4. **Keep tests independent.** No test should depend on another's result or
   leftover data. Each test sets up its own state.
5. **Reuse login sessions** with Playwright `storageState` to skip logging in
   through the UI on every test — a big speed-up at scale.
6. **Run in parallel** (`workers`), and shard across CI machines for very large
   suites (`--shard=1/4`, `--shard=2/4`, ...).
7. **Treat flaky tests as bugs.** Use `retryHelper` only for genuinely
   non-deterministic operations, never to paper over real defects.
8. **Centralize test data** in `src/data/`; never hard-code data in tests.
9. **Keep environments config-driven** so the same tests run everywhere by only
   changing `TEST_ENV`.
10. **Review reports, not just pass/fail.** Traces, videos, and Allure history
    make failures fast to diagnose.

---

## 12. How to add a new test (beginner walkthrough)

1. Need a new screen? Create `src/pages/MyPage.ts` extending `BasePage`, and
   `src/pages/locators/mypage.locators.ts` for its selectors.
2. Expose it in `src/fixtures/test-fixtures.ts` so tests can request it.
3. Create `tests/ui/smoke/myfeature.smoke.spec.ts` and write your test using the
   fixture. Add a tag like `@smoke`.
4. Run it: `npm run test:smoke`.

That's it — happy testing!
