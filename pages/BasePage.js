const { expect } = require('@playwright/test');
const { HeaderComponent } = require('../components/HeaderComponent');
const { FooterComponent } = require('../components/FooterComponent');

class BasePage {
  constructor(page) {
    this.page = page;
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
    this.content = page.locator('#content');
  }

  async open(path) {
    await this.blockKnownThirdPartyNoise();
    await this.page.goto(path);
    return this;
  }

  async blockKnownThirdPartyNoise() {
    if (this.page.__redmineThirdPartyNoiseBlocked) {
      return this;
    }

    this.page.__redmineThirdPartyNoiseBlocked = true;
    await this.page.route(/googlesyndication|googletagservices|doubleclick|google-analytics/, async (route) => {
      await route.fulfill({ status: 204, body: '' });
    });

    return this;
  }

  async expectPageReady() {
    await expect(this.content).toBeVisible();
    await this.footer.expectVisible();
    return this;
  }

  async expectNoServerError() {
    await expect(this.content).not.toContainText(/Internal error|Internal Server Error|The page you were trying to access doesn't exist/i);
    return this;
  }
}

module.exports = {
  BasePage,
};
