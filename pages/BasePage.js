const { expect } = require('@playwright/test');
const { HeaderComponent } = require('../components/HeaderComponent');
const { FooterComponent } = require('../components/FooterComponent');

const pagesWithBlockedThirdPartyNoise = new WeakSet();

class BasePage {
  constructor(page) {
    this.page = page;
    this.body = page.locator('body');
    this.header = new HeaderComponent(page);
    this.footer = new FooterComponent(page);
    this.content = page.locator('#content');
  }

  async open(path) {
    await this.blockKnownThirdPartyNoise();
    const response = await this.page.goto(path);
    await this.expectSiteAvailable(response);
    return this;
  }

  async blockKnownThirdPartyNoise() {
    if (pagesWithBlockedThirdPartyNoise.has(this.page)) {
      return this;
    }

    pagesWithBlockedThirdPartyNoise.add(this.page);
    await this.page.route(/googlesyndication|googletagservices|doubleclick|google-analytics/, async (route) => {
      await route.fulfill({ status: 204, body: '' });
    });

    return this;
  }

  async expectPageReady() {
    await this.expectSiteAvailable();
    await expect(this.content).toBeVisible();
    await this.footer.expectVisible();
    return this;
  }

  async expectNoServerError() {
    await this.expectSiteAvailable();
    await expect(this.content).not.toContainText(/Internal error|Internal Server Error|The page you were trying to access doesn't exist/i);
    return this;
  }

  async expectSiteAvailable(response) {
    if (response) {
      expect(response.status(), `Expected Redmine to be available at ${response.url()}`).toBeLessThan(500);
    }

    await expect(this.body).not.toContainText(/under heavy load|queue full|Service Unavailable|Bad Gateway|Gateway Timeout/i);
    return this;
  }
}

module.exports = {
  BasePage,
};
