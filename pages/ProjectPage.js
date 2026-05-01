const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class ProjectPage extends BasePage {
  async openOverview() {
    await this.open('/projects/redmine');
    await this.expectProjectContext();
    return this;
  }

  async expectProjectContext() {
    await expect(this.page.locator('#header h1')).toContainText('Redmine');
    await this.header.expectProjectNavigationVisible();
    return this;
  }

  async openTab(tab) {
    await (await this.header.visibleLink(this.header.projectMenu, tab.name, { exact: true })).click();
    return this;
  }

  async expectTabContent(tab) {
    await expect(this.page).toHaveURL(new RegExp(`${escapeRegExp(tab.path)}(?:[?#].*)?$`));
    await this.expectProjectContext();
    await expect(this.content).toContainText(new RegExp(tab.marker));
    return this;
  }
}

module.exports = {
  ProjectPage,
};
