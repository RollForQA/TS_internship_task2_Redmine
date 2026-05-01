const { test } = require('../support/fixtures');

test('TC-01: Verify Redmine home page overview, release, resource, and feature sections @smoke', async ({ homePage }) => {
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
});
