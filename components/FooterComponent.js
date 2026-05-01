const { expect } = require('@playwright/test');

class FooterComponent {
  constructor(page) {
    this.footer = page.locator('#footer');
  }

  async expectVisible() {
    await expect(this.footer).toBeVisible();
    await expect(this.footer).toContainText('Powered by Redmine');
    return this;
  }
}

module.exports = {
  FooterComponent,
};
