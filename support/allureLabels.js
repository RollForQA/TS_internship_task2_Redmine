const { allure } = require('allure-playwright');

async function labelTest({ epic, feature, story, tag, severity = 'normal' }) {
  await allure.epic(epic);
  await allure.feature(feature);
  await allure.story(story);
  await allure.severity(severity);

  if (tag) {
    await allure.tags(tag);
  }
}

module.exports = {
  labelTest,
};
