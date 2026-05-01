const { test } = require('@playwright/test');

const { ProjectPage } = require('../pages/ProjectPage');
const { labelTest } = require('../support/allureLabels');
const { attachPageErrorChecks } = require('../support/pageErrorChecks');
const { projectTabs } = require('../fixtures/redmine-data.json');

test('TC-02: Verify Redmine project navigation tabs open the expected public pages @smoke', async ({ page }) => {
  await labelTest({
    epic: 'Public Site',
    feature: 'Project Navigation',
    story: 'TC-02 Project tabs',
    tag: 'smoke',
    severity: 'critical',
  });

  const browserErrors = attachPageErrorChecks(page);
  const projectPage = new ProjectPage(page);

  await test.step('Open Redmine project overview', async () => {
    await projectPage.openOverview();
    await projectPage.expectPageReady();
  });

  for (const tab of projectTabs) {
    await test.step(`Verify ${tab.name} tab`, async () => {
      await projectPage.openTab(tab);
      await projectPage.expectTabContent(tab);
    });
  }

  await test.step('Verify browser runtime has no critical errors', async () => {
    await browserErrors.expectNoCriticalErrors();
  });
});
