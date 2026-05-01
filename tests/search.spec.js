const { test } = require('@playwright/test');

const { HomePage } = require('../pages/HomePage');
const { SearchPage } = require('../pages/SearchPage');
const { labelTest } = require('../support/allureLabels');
const { attachPageErrorChecks } = require('../support/pageErrorChecks');
const { searchQueries } = require('../fixtures/redmine-data.json');

test('TC-04: Verify global header search handles valid and no-result public queries @regression', async ({ page }) => {
  await labelTest({
    epic: 'Public Site',
    feature: 'Global Search',
    story: 'TC-04 Header search variants',
    tag: 'regression',
    severity: 'normal',
  });

  const browserErrors = attachPageErrorChecks(page);
  const homePage = new HomePage(page);
  const searchPage = new SearchPage(page);

  for (const queryData of searchQueries) {
    await test.step(`Submit ${queryData.name}`, async () => {
      await homePage.open();
      await homePage.header.search(queryData.value);
      await searchPage.expectSearchPage(queryData.value);

      if (queryData.expectResults) {
        await searchPage.expectResultsFor(queryData.value);
      } else {
        await searchPage.expectSafeEmptyOrEdgeCaseHandling();
      }
    });
  }

  await test.step('Verify browser runtime has no critical errors', async () => {
    await browserErrors.expectNoCriticalErrors();
  });
});
