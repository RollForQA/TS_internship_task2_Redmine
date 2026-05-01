const { test } = require('../support/fixtures');
const { issueData } = require('../fixtures/redmine-data.json');

test('TC-03: Verify Issues page default list, custom queries, and filter controls @regression', async ({ issuesPage }) => {
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

  await test.step('Verify tracker representation, rows, and pagination', async () => {
    await issuesPage.expectTrackerRepresentation(issueData.trackerLabels);
    await issuesPage.expectOptionalColumnIfPresent('Category');
    await issuesPage.expectIssueRows();
  });

  await test.step('Verify a safe custom query target', async () => {
    await issuesPage.expectCustomQueryLinkTarget(issueData.safeCustomQuery);
  });
});
