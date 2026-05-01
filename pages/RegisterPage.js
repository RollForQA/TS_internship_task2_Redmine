const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');
const { guardInvalidRegisterPost } = require('../support/registerGuard');
const { buildFakeUser } = require('../support/userBuilder');

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
    await guardInvalidRegisterPost(this.page, 'empty required fields', ({ login, password, firstName, lastName, email }) => (
      !login || !password || !firstName || !lastName || !email
    ));
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
    await guardInvalidRegisterPost(this.page, 'short password', ({ password }) => password.length < 8);
    await this.fillBaseUser(buildFakeUser(data.fakeUser));
    await this.passwordInput.fill(data.shortPassword);
    await this.passwordConfirmationInput.fill(data.shortPassword);
    await this.submitForm();
    await this.expectValidationErrors(/Password is too short|Password.*8 characters|too short/i);
    return this;
  }

  async expectPasswordBoundaryBlockedByOtherValidation(data) {
    await guardInvalidRegisterPost(this.page, 'password boundary with missing last name', ({ password, confirmation, lastName }) => (
      password.length >= 8 && password === confirmation && !lastName
    ));
    const fakeUser = buildFakeUser(data.fakeUser, 'boundary');

    await this.fillBaseUser({ ...fakeUser, lastName: '' });
    await this.passwordInput.fill(data.boundaryPassword);
    await this.passwordConfirmationInput.fill(data.boundaryPassword);
    await this.submitForm();

    // Keep another required-field error in the submitted data so the test never creates a real account.
    await this.expectValidationErrors(/Last name/i);
    await expect(this.errors).not.toContainText(/Password is too short|Password.*too short/i);
    return this;
  }

  async submitPasswordMismatch(data) {
    await guardInvalidRegisterPost(this.page, 'password mismatch', ({ password, confirmation }) => (
      password.length >= 8 && confirmation.length >= 8 && password !== confirmation
    ));
    await this.fillBaseUser({
      ...buildFakeUser(data.fakeUser, 'mismatch'),
    });
    await this.passwordInput.fill(data.mismatchPassword);
    await this.passwordConfirmationInput.fill(data.mismatchConfirmation);
    await this.submitForm();
    await this.expectValidationErrors(/Password doesn't match confirmation|Confirmation doesn't match Password|Password confirmation/i);
    return this;
  }

  async submitForm() {
    await expect(this.submitButton).toBeVisible();
    await this.submitButton.click();
    return this;
  }

  async expectValidationErrors(pattern) {
    await expect(this.page).toHaveURL(/\/account\/register/);
    await expect(this.errors).toBeVisible();
    await expect(this.errors).toContainText(pattern);
    return this;
  }
}

module.exports = {
  RegisterPage,
};
