const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class SearchPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchField = page.locator('#content input[name="q"]');
  }

  async expectSearchPage(query) {
    await expect(this.page).toHaveURL(/\/search(?:\?|$)/);
    await expect(this.content.getByRole('heading', { name: 'Search' })).toBeVisible();
    await expect(this.searchField).toBeVisible();
    await this.expectNoServerError();

    if (query) {
      await expect(this.searchField).toHaveValue(query);
    }

    return this;
  }

  async expectResultsFor(query) {
    await this.expectSearchPage(query);
    await expect(this.content).toContainText(/Results \(\d+\)|Issues|Wiki pages|Messages|Redmine plugins/);
    return this;
  }

  async expectSafeEmptyOrEdgeCaseHandling() {
    await expect(this.content).not.toContainText(/Internal Server Error|Traceback|Exception/i);
    return this;
  }
}

module.exports = {
  SearchPage,
};
