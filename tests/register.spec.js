const { test } = require('@playwright/test');

const { RegisterPage } = require('../pages/RegisterPage');
const { labelTest } = require('../support/allureLabels');
const { attachPageErrorChecks } = require('../support/pageErrorChecks');
const { registerData } = require('../fixtures/redmine-data.json');

test('TC-05: Verify Register form required fields and password validation without creating an account @regression', async ({ page }) => {
  await labelTest({
    epic: 'Authentication',
    feature: 'Register Validation',
    story: 'TC-05 Register validation',
    tag: 'regression',
    severity: 'critical',
  });

  const browserErrors = attachPageErrorChecks(page);
  const registerPage = new RegisterPage(page);

  await test.step('Open Register page and verify fields', async () => {
    await registerPage.open();
    await registerPage.expectPageReady();
    await registerPage.expectRequiredFields();
    await registerPage.expectOptionalFields();
  });

  await test.step('Submit empty required fields', async () => {
    await registerPage.submitEmptyForm();
  });

  await test.step('Submit short password data', async () => {
    await registerPage.open();
    await registerPage.submitShortPassword(registerData);
  });

  await test.step('Verify exactly 8-character password boundary without creating account', async () => {
    await registerPage.open();
    await registerPage.expectPasswordBoundaryBlockedByOtherValidation(registerData);
  });

  await test.step('Submit password mismatch data', async () => {
    await registerPage.open();
    await registerPage.submitPasswordMismatch(registerData);
  });

  await test.step('Verify browser runtime has no critical errors', async () => {
    await browserErrors.expectNoCriticalErrors();
  });
});
