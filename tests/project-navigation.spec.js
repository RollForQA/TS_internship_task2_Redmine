const { test } = require('../support/fixtures');
const { projectTabs } = require('../fixtures/redmine-data.json');

test('TC-02: Verify Redmine project navigation tabs open the expected public pages @smoke', async ({ projectPage }) => {
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
});
