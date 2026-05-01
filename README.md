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
7. Publish the report to the `gh-pages` branch of the same repository.

GitHub Pages should be enabled in the repository settings with source branch `gh-pages` and folder `/`.

## Project Structure

```text
components/             Shared header and footer components
fixtures/               Data sets from the Automation Data sheet
pages/                  Page Object Model classes
support/                Allure helpers
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

Register validation scenarios intercept `POST /account/register` with `page.route()` and return controlled validation responses. This keeps the flow aligned with the production form safety rule: no real account is created and no registration POST is sent to Redmine.

The assignment requires exactly five automated tests. Some tests intentionally cover several related checks in a single user flow, with sub-scenarios represented as `test.step()` blocks and Allure steps.
