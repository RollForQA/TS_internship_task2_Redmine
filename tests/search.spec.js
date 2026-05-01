const { test } = require('../support/fixtures');
const { searchQueries } = require('../fixtures/redmine-data.json');

test('TC-04: Verify global header search handles valid and no-result public queries @regression', async ({ homePage, searchPage }) => {
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
});
