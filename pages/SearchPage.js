const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class SearchPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchField = this.content.getByRole('textbox', { name: /search/i }).first();
    this.resultList = this.content.locator('#search-results');
    this.resultItems = this.resultList.locator('dt');
  }

  async expectSearchPage(query) {
    await expect(this.page).toHaveURL(/\/search(?:\?|$)/);
    await expect(this.content.getByRole('heading', { name: 'Search' })).toBeVisible();
    await expect(this.searchField).toBeVisible();
    await this.expectNoServerError();

    if (query !== undefined) {
      await expect(this.searchField).toHaveValue(query);
    }

    return this;
  }

  async expectResultsFor(query) {
    await this.expectSearchPage(query);
    await expect(this.content).toContainText(/Results \(\d+/);
    await expect(this.resultList).toBeVisible();
    await expect(this.resultItems.first()).toBeVisible();
    return this;
  }

  async expectSafeEmptyOrEdgeCaseHandling() {
    await expect(this.content).not.toContainText(/Internal Server Error|Traceback|Exception/i);
    await expect(this.content.locator('#errorExplanation, .flash.error')).toHaveCount(0);
    return this;
  }

  async expectQueryRenderedAsText(query) {
    await expect(this.searchField).toHaveValue(query);
    await expect(this.page.locator('script', { hasText: query })).toHaveCount(0);
    return this;
  }
}

module.exports = {
  SearchPage,
};
