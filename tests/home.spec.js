const { test } = require('@playwright/test');

const { HomePage } = require('../pages/HomePage');
const { labelTest } = require('../support/allureLabels');
const { attachPageErrorChecks } = require('../support/pageErrorChecks');

test('TC-01: Verify Redmine home page overview, release, resource, and feature sections @smoke', async ({ page }) => {
  await labelTest({
    epic: 'Public Site',
    feature: 'Home',
    story: 'TC-01 Home overview content',
    tag: 'smoke',
    severity: 'critical',
  });

  const browserErrors = attachPageErrorChecks(page);
  const homePage = new HomePage(page);

  await test.step('Open Redmine home page', async () => {
    await homePage.open();
    await homePage.expectPageReady();
  });

  await test.step('Verify header and project navigation', async () => {
    await homePage.expectHeaderVisible();
  });

  await test.step('Verify sidebar blocks and overview content sections', async () => {
    await homePage.expectSidebarBlocks();
    await homePage.expectOverviewSections();
  });

  await test.step('Verify browser runtime has no critical errors', async () => {
    await browserErrors.expectNoCriticalErrors();
  });
});
