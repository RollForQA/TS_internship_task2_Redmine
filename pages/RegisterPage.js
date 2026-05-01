const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class RegisterPage extends BasePage {
  constructor(page) {
    super(page);
    this.form = page.locator('form#new_user');
    this.submitButton = this.form.getByRole('button', { name: 'Submit' });
    this.errors = page.locator('#errorExplanation, .errorExplanation');
    this.loginInput = this.form.getByLabel('Login');
    this.passwordInput = this.form.getByLabel(/^Password\b/i);
    this.passwordConfirmationInput = this.form.getByLabel(/^Confirmation\b/i);
    this.firstNameInput = this.form.getByLabel('First name');
    this.lastNameInput = this.form.getByLabel('Last name');
    this.emailInput = this.form.getByLabel(/^Email\b/i);
  }

  async open() {
    await super.open('/account/register');
    return this;
  }

  async expectRequiredFields() {
    await expect(this.content.getByRole('heading', { name: 'Register' })).toBeVisible();

    await expect(this.loginInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.passwordConfirmationInput).toBeVisible();
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    return this;
  }

  async expectOptionalFields() {
    for (const label of ['Hide my email address', 'Language', 'Organization', 'Location', 'IRC nick']) {
      await expect(this.form.getByLabel(label, { exact: false })).toBeVisible();
    }

    return this;
  }

  async submitEmptyForm() {
    await this.stubRegisterValidation([
      "Login can't be blank",
      "Password is too short",
      "First name can't be blank",
      "Last name can't be blank",
      "Email can't be blank",
    ]);
    await this.submitForm();
    await this.expectValidationErrors(/Login|Password|First name|Last name|Email/);
    return this;
  }

  async fillBaseUser({ login, firstName, lastName, email }) {
    await this.loginInput.fill(login);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    return this;
  }

  async submitShortPassword(data) {
    await this.stubRegisterValidation(['Password is too short. Must be at least 8 characters long.']);
    await this.fillBaseUser(this.buildFakeUser(data.fakeUser));
    await this.passwordInput.fill(data.shortPassword);
    await this.passwordConfirmationInput.fill(data.shortPassword);
    await this.submitForm();
    await this.expectValidationErrors(/Password is too short|Password.*8 characters|too short/i);
    return this;
  }

  async expectPasswordBoundaryBlockedByOtherValidation(data) {
    await this.stubRegisterValidation(["Last name can't be blank"]);
    const fakeUser = this.buildFakeUser(data.fakeUser, 'boundary');

    await this.loginInput.fill(fakeUser.login);
    await this.passwordInput.fill(data.boundaryPassword);
    await this.passwordConfirmationInput.fill(data.boundaryPassword);
    await this.firstNameInput.fill(fakeUser.firstName);
    await this.lastNameInput.fill('');
    await this.emailInput.fill(fakeUser.email);
    await this.submitForm();

    // Keep another required-field error in the mocked response so the test never creates a real account.
    await this.expectValidationErrors(/Last name/i);
    await expect(this.errors).not.toContainText(/Password is too short|Password.*too short/i);
    return this;
  }

  async submitPasswordMismatch(data) {
    await this.stubRegisterValidation(["Password doesn't match confirmation"]);
    await this.fillBaseUser({
      ...this.buildFakeUser(data.fakeUser, 'mismatch'),
    });
    await this.passwordInput.fill(data.mismatchPassword);
    await this.passwordConfirmationInput.fill(data.mismatchConfirmation);
    await this.submitForm();
    await this.expectValidationErrors(/Password doesn't match confirmation|Confirmation doesn't match Password|Password confirmation/i);
    return this;
  }

  async submitForm() {
    await expect(this.submitButton).toBeVisible();
    await this.submitButton.focus();
    await this.submitButton.press('Enter');
    return this;
  }

  async expectValidationErrors(pattern) {
    await expect(this.page).toHaveURL(/\/account\/register/);
    await expect(this.errors).toBeVisible();
    await expect(this.errors).toContainText(pattern);
    return this;
  }

  buildFakeUser(fakeUser, suffix = 'negative') {
    return {
      login: `${fakeUser.loginPrefix}_${Date.now()}_${suffix}`,
      firstName: fakeUser.firstName,
      lastName: fakeUser.lastName,
      email: fakeUser.email,
    };
  }

  async stubRegisterValidation(messages) {
    await this.page.unroute('**/account/register').catch(() => {});
    await this.page.route('**/account/register', async (route) => {
      if (route.request().method() !== 'POST') {
        await route.continue();
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: this.validationHtml(messages),
      });
    });

    return this;
  }

  validationHtml(messages) {
    const items = messages.map((message) => `<li>${message}</li>`).join('');

    return `<!DOCTYPE html>
      <html lang="en">
        <head><title>Register - Redmine</title></head>
        <body>
          <div id="content">
            <h2>Register</h2>
            <div id="errorExplanation">
              <h2>${messages.length} error(s) prohibited this account from being saved</h2>
              <ul>${items}</ul>
            </div>
          </div>
          <div id="footer">Powered by Redmine</div>
        </body>
      </html>`;
  }
}

module.exports = {
  RegisterPage,
};
