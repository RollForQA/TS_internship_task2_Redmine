const { expect } = require('@playwright/test');

class HeaderComponent {
  constructor(page) {
    this.page = page;
    this.topMenu = page.locator('#top-menu');
    this.accountMenu = page.locator('#account');
    this.projectMenu = page.locator('#main-menu');
    this.flyoutMenu = page.locator('.js-flyout-menu');
    this.quickSearch = page.locator('#quick-search');
    this.searchInput = this.quickSearch.locator('input#q');
    this.flyoutSearchInput = this.flyoutMenu.locator('input#flyout-search');
  }

  async visibleLink(container, name, options = {}) {
    const desktopLink = container.getByRole('link', { name, ...options }).first();

    if (await desktopLink.count() && await desktopLink.isVisible()) {
      return desktopLink;
    }

    return this.flyoutMenu.getByRole('link', { name, ...options }).first();
  }

  async expectGlobalNavigationVisible() {
    await expect(await this.visibleLink(this.topMenu, 'Home')).toBeVisible();
    await expect(await this.visibleLink(this.topMenu, 'Projects')).toBeVisible();
    await expect(await this.visibleLink(this.topMenu, 'Help')).toBeVisible();
    await expect(await this.visibleLink(this.accountMenu, 'Sign in')).toBeVisible();
    await expect(await this.visibleLink(this.accountMenu, 'Register')).toBeVisible();

    if (await this.searchInput.isVisible()) {
      await expect(this.searchInput).toBeVisible();
    } else {
      await expect(this.flyoutSearchInput).toBeVisible();
    }

    return this;
  }

  async expectProjectNavigationVisible() {
    await expect(await this.visibleLink(this.projectMenu, 'Overview')).toBeVisible();
    await expect(await this.visibleLink(this.projectMenu, 'Download')).toBeVisible();
    await expect(await this.visibleLink(this.projectMenu, 'Activity')).toBeVisible();
    await expect(await this.visibleLink(this.projectMenu, 'Roadmap')).toBeVisible();
    await expect(await this.visibleLink(this.projectMenu, 'Issues')).toBeVisible();
    await expect(await this.visibleLink(this.projectMenu, 'News')).toBeVisible();
    await expect(await this.visibleLink(this.projectMenu, 'Wiki')).toBeVisible();
    await expect(await this.visibleLink(this.projectMenu, 'Forums')).toBeVisible();
    return this;
  }

  async search(query) {
    const input = await this.searchInput.isVisible() ? this.searchInput : this.flyoutSearchInput;

    await expect(input).toBeVisible();
    await input.fill(query);
    await input.press('Enter');
    return this;
  }
}

module.exports = {
  HeaderComponent,
};
