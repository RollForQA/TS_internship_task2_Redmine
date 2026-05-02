const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  async open() {
    await super.open('/');
    return this;
  }

  async expectHeaderVisible() {
    await this.header.expectGlobalNavigationVisible();
    await this.header.expectProjectNavigationVisible();
    await expect(this.content.locator('h1')).toContainText('Redmine');
    return this;
  }

  async expectSidebarBlocks() {
    await expect(this.page.getByRole('heading', { name: /Latest releases/i })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /Resources/i })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: /^Wiki$/i })).toBeVisible();
    await expect(this.page.getByRole('link', { name: /User's Guide/i }).first()).toBeVisible();
    await expect(this.page.getByRole('link', { name: /Developer's Guide/i }).first()).toBeVisible();
    await this.expectKeyResourceLinksWithinRedmine();
    return this;
  }

  async expectKeyResourceLinksWithinRedmine() {
    const internalHref = /^(\/|https:\/\/www\.redmine\.org\/)/;
    const keyResourceLinks = [
      /User's Guide/i,
      /Developer's Guide/i,
      /Redmine features/i,
    ];

    for (const linkName of keyResourceLinks) {
      const link = this.page.getByRole('link', { name: linkName }).first();

      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute('href', internalHref);
    }

    return this;
  }

  async expectOverviewSections() {
    const sections = [
      /Features/i,
      /Documentation/i,
      /Online demo/i,
      /Support & getting help/i,
      /Contributing and helping out/i,
      /Who uses Redmine\?/i,
      /Redmine books/i,
    ];

    for (const sectionName of sections) {
      await expect(this.content.getByRole('heading', { name: sectionName })).toBeVisible();
    }

    await expect(this.content).toContainText('Redmine is a flexible project management web application');
    await expect(this.content.getByRole('link', { name: /Redmine features/i })).toBeVisible();
    return this;
  }
}

module.exports = {
  HomePage,
};
