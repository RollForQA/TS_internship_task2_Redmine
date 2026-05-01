# Redmine.org Test Plan Matrix

The full manual test plan is maintained in [docs/Redmine_Test_Plan.xlsx](docs/Redmine_Test_Plan.xlsx). This matrix keeps the automated Playwright coverage traceable for the workspace checklist.

| TC ID | Feature | Scenario | Priority | Tag | Spec File | Status |
| --- | --- | --- | --- | --- | --- | --- |
| TC-01 | Home | Verify Redmine home page overview, release, resource, and feature sections | High | @smoke | tests/home.spec.js | Automated |
| TC-02 | Project Navigation | Verify Redmine project navigation tabs open the expected public pages | High | @smoke | tests/project-navigation.spec.js | Automated |
| TC-03 | Issues List | Verify Issues page default list, custom queries, and filter controls | Medium | @regression | tests/issues.spec.js | Automated |
| TC-04 | Header Search | Verify global header search handles valid and no-result public queries | Medium | @regression | tests/search.spec.js | Automated |
| TC-05 | Register Validation | Verify Register form required fields and password validation without creating an account | High | @regression | tests/register.spec.js | Automated with blocked POST route |

## Browser And Viewport Matrix

| Layer | Browser / Viewport | Command | When to Run |
| --- | --- | --- | --- |
| Smoke and default quality | Chromium desktop | `npm test` or `npm run quality` | Local development and pull requests |
| Extended cross-browser | Chromium, Firefox, WebKit desktop | `npm run test:cross-browser` | Before final submission or release |
| Responsive check | Pixel 5 mobile viewport | `npm run test:mobile` | Before final submission |

## Manual Scope Notes

Automation intentionally does not create real accounts, edit Redmine content, create issues, post forum messages, or test third-party sites deeply. Registration submit actions use a `page.route()` guard that allows only expected invalid payloads to reach Redmine and blocks any potentially valid account payload.

The assignment requires exactly five automated tests, so TC-04 and TC-05 intentionally group related sub-scenarios under one traceable test case using Playwright `test.step()` blocks.
