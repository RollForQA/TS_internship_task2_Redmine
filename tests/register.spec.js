const { test } = require('../support/fixtures');
const { registerData } = require('../fixtures/redmine-data.json');

test('TC-05: Verify Register form required fields and password validation without creating an account @regression', async ({ registerPage }) => {
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
});
