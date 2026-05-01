const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

class IssuesPage extends BasePage {
  constructor(page) {
    super(page);
    this.issueTable = page.locator('table.issues');
  }

  async open() {
    await super.open('/projects/redmine/issues');
    return this;
  }

  async expectHeading() {
    await expect(this.content.getByRole('heading', { name: 'Issues' })).toBeVisible();
    return this;
  }

  async expectCustomQueries(customQueries) {
    await expect(this.page.getByRole('heading', { name: /Custom queries/i })).toBeVisible();

    for (const queryName of customQueries) {
      await expect(this.page.getByRole('link', { name: queryName })).toBeVisible();
    }

    return this;
  }

  async expectFilterControls() {
    await expect(this.page.locator('#query_form')).toBeVisible();
    await expect(this.content).toContainText('Filters');
    await expect(this.content).toContainText('Options');
    await expect(this.page.getByRole('link', { name: 'Apply' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Clear' })).toBeVisible();
    return this;
  }

  async expectCoreIssueColumns(columns) {
    await expect(this.issueTable).toBeVisible();
    const header = this.issueTable.locator('thead');

    for (const column of columns) {
      await expect(header).toContainText(column);
    }

    return this;
  }

  async expectTrackerRepresentation(trackerLabels) {
    const trackerHeader = this.issueTable.locator('thead').getByText('Tracker', { exact: true });

    if (await trackerHeader.count()) {
      await expect(trackerHeader.first()).toBeVisible();
      return this;
    }

    // Redmine public query columns can differ, so fall back to row content when the Tracker column is hidden.
    await expect(this.issueTable.locator('tbody')).toContainText(new RegExp(trackerLabels.map(escapeRegExp).join('|')));
    return this;
  }

  async expectOptionalColumnIfPresent(columnName) {
    const columnHeader = this.issueTable.locator('thead').getByText(columnName, { exact: true });

    if (await columnHeader.count()) {
      await expect(columnHeader.first()).toBeVisible();
    }

    return this;
  }

  async expectIssueRows() {
    await expect(this.issueTable.locator('tbody tr.issue').first()).toBeVisible();
    await expect(this.content).toContainText(/\(\d+-\d+\/\d+\)/);
    return this;
  }

  async expectCustomQueryLinkTarget(queryName) {
    const queryLink = this.page.getByRole('link', { name: queryName });

    await expect(queryLink).toBeVisible();
    await expect(queryLink).toHaveAttribute('href', /\/projects\/redmine\/issues\?query_id=\d+/);
    return this;
  }
}

module.exports = {
  IssuesPage,
};
