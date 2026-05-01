let allure;

try {
  ({ allure } = require('allure-playwright'));
} catch {
  allure = null;
}

const noop = async () => {};

function getAllure() {
  return allure || {
    epic: noop,
    feature: noop,
    story: noop,
    severity: noop,
    tags: noop,
  };
}

async function labelTest({ epic, feature, story, tag, severity = 'normal' }) {
  const reporter = getAllure();

  await reporter.epic(epic);
  await reporter.feature(feature);
  await reporter.story(story);
  await reporter.severity(severity);

  if (tag) {
    await reporter.tags(tag);
  }
}

module.exports = {
  labelTest,
};
