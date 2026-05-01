# Redmine.org Playwright Tests

Automated Playwright test suite for [Redmine.org](https://www.redmine.org/) based on the manual test plan in [docs/Redmine_Test_Plan.xlsx](docs/Redmine_Test_Plan.xlsx).

Allure GitHub Pages report: [https://rollforqa.github.io/TS_internship_task2_Redmine/](https://rollforqa.github.io/TS_internship_task2_Redmine/)

## Coverage

- `TC-01 @smoke` - Home page overview, release, resource, and feature sections.
- `TC-02 @smoke` - Redmine project navigation tabs.
- `TC-03 @regression` - Issues page list, custom queries, filters, and core columns.
- `TC-04 @regression` - Header search with valid, empty, special-character, long, and no-result queries.
- `TC-05 @regression` - Register form required fields and password validation without account creation.

## Tech Stack

- Playwright Test
- Page Object Model
- Allure Playwright reporter
- Chromium, Firefox, WebKit projects

## Install

```bash
npm ci
npx playwright install
```

For Allure HTML report generation, Java 17 is required. The local helper script reads `JAVA_HOME` when available and also supports the default Temurin JDK 17 Windows installation path.

## Run Tests

```bash
npm test
```

`npm test` runs the default local quality layer: Chromium desktop.

Run all configured browsers:

```bash
npm run test:cross-browser
```

The suite targets the live Redmine site, so local parallelism is conservative by default. Override it only when needed:

```bash
PLAYWRIGHT_WORKERS=2 PLAYWRIGHT_RETRIES=1 npm run test:cross-browser
```

Run mobile viewport coverage:

```bash
npm run test:mobile
```

Run only Chromium explicitly:

```bash
npm run test:chromium
```

Run smoke or regression tests:

```bash
npm run test:smoke
npm run test:regression
```

## Reports

Playwright HTML report:

```bash
npm run report:html
```

Allure report:

```bash
npm run report:allure
npm run report:allure:open
```

Allure raw results are written to `allure-results/`. Generated Allure HTML is written to `allure-report/`.

## Quality Check

```bash
npm run quality
```

This runs ESLint, static workspace rule checks, and the default Chromium Playwright suite.

## Continuous Integration And Allure Pages

The GitHub Actions workflow in `.github/workflows/playwright-allure.yml` covers the assignment pipeline:

1. Install Node dependencies with `npm ci`.
2. Install Playwright browsers.
3. Run lint and workspace rule checks.
4. Run Playwright tests.
5. Copy Allure history from the previous `gh-pages` report branch.
6. Generate a new Allure report.
7. Upload Playwright and Allure artifacts for every run.
8. Publish the report to the `gh-pages` branch of the same repository for pushes and manual runs.

GitHub Pages should be enabled in the repository settings with source branch `gh-pages` and folder `/`.

## Project Structure

```text
components/             Shared header and footer components
fixtures/               Data sets from the Automation Data sheet
pages/                  Page Object Model classes
support/                Playwright fixtures, Allure helpers, guards, and builders
tests/                  TC-01 ... TC-05 Playwright specs
docs/                   Manual test plan and test-case rules
.github/workflows/      GitHub Actions Allure pipeline
```

## Browser And Viewport Matrix

| Layer | Browser / Viewport | Command | When to Run |
| --- | --- | --- | --- |
| Default quality | Chromium desktop | `npm test`, `npm run quality` | Local development and pull requests |
| Extended cross-browser | Chromium, Firefox, WebKit desktop | `npm run test:cross-browser` | Before final submission |
| Responsive check | Pixel 5 mobile viewport | `npm run test:mobile` | Before final submission |

## Notes

The Redmine home page is part of the Redmine project context, so its header search form currently routes to `/projects/redmine/search`. The automated test treats this as the header search flow and verifies that the route contains `/search`, the query is preserved, and the page handles all query variants safely.

Register validation scenarios use real invalid Redmine form submissions. The shared route guard in `support/registerGuard.js` inspects each `POST /account/register` payload and allows only the expected invalid payload for the active scenario. If a scenario ever tries to submit a potentially valid account, the guard returns a fail-safe blocked response instead of creating an account.

Shared Playwright fixtures in `support/fixtures.js` create page objects, apply Allure labels from `support/testMetadata.js`, and automatically verify browser console/page errors after each test. Common Redmine availability checks live in `pages/BasePage.js`, so specs stay focused on user scenarios instead of setup assertions.

The assignment requires exactly five automated tests. Some tests intentionally cover several related checks in a single user flow, with sub-scenarios represented as `test.step()` blocks and Allure steps.

## Known Limitations

These tests run against the public live `redmine.org` site, so content, public query results, and response times can change outside this repository. Assertions prefer stable page structure and public labels, but failures should still be reviewed against the current production page before treating them as product regressions.
