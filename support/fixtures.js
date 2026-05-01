const { test: base, expect } = require('@playwright/test');

const { HomePage } = require('../pages/HomePage');
const { IssuesPage } = require('../pages/IssuesPage');
const { ProjectPage } = require('../pages/ProjectPage');
const { RegisterPage } = require('../pages/RegisterPage');
const { SearchPage } = require('../pages/SearchPage');
const { labelTest } = require('./allureLabels');
const { attachPageErrorChecks } = require('./pageErrorChecks');
const { labelsForTitle } = require('./testMetadata');

const test = base.extend({
  allureLabels: [async ({ page }, use, testInfo) => {
    void page;

    const labels = labelsForTitle(testInfo.title);

    if (labels) {
      await labelTest(labels);
    }

    await use(undefined);
  }, { auto: true }],

  browserErrors: [async ({ page }, use) => {
    const browserErrors = attachPageErrorChecks(page);

    await use(browserErrors);

    await base.step('Verify browser runtime has no critical errors', async () => {
      await browserErrors.expectNoCriticalErrors();
    });
  }, { auto: true }],

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  issuesPage: async ({ page }, use) => {
    await use(new IssuesPage(page));
  },

  projectPage: async ({ page }, use) => {
    await use(new ProjectPage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
});

module.exports = {
  expect,
  test,
};
