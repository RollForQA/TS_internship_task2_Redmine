const { test } = require('@playwright/test');

const { IssuesPage } = require('../pages/IssuesPage');
const { labelTest } = require('../support/allureLabels');
const { issueData } = require('../fixtures/redmine-data.json');

test('TC-03: Verify Issues page default list, custom queries, and filter controls @regression', async ({ page }) => {
  await labelTest({
    epic: 'Issue Tracking',
    feature: 'Issues List',
    story: 'TC-03 Issues page controls',
    tag: 'regression',
    severity: 'normal',
  });

  const issuesPage = new IssuesPage(page);

  await test.step('Open Redmine Issues page', async () => {
    await issuesPage.open();
    await issuesPage.expectPageReady();
    await issuesPage.expectHeading();
  });

  await test.step('Verify custom queries, filters, options, and core columns', async () => {
    await issuesPage.expectCustomQueries(issueData.customQueries);
    await issuesPage.expectFilterControls();
    await issuesPage.expectCoreIssueColumns(issueData.coreColumns);
  });

  await test.step('Verify tracker representation, optional category, rows, and pagination', async () => {
    await issuesPage.expectTrackerRepresentation(issueData.trackerLabels);
    await issuesPage.expectOptionalColumn('Category');
    await issuesPage.expectIssueRows();
  });

  await test.step('Open a safe custom query', async () => {
    await issuesPage.openCustomQuery(issueData.safeCustomQuery);
  });
});
