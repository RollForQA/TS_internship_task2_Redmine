const { expect } = require('@playwright/test');

function attachPageErrorChecks(page, allowlist = []) {
  const errors = [];

  const isAllowed = (message) => allowlist.some((pattern) => (
    pattern instanceof RegExp ? pattern.test(message) : message.includes(pattern)
  ));

  page.on('pageerror', (exception) => {
    const message = exception.message || String(exception);

    if (!isAllowed(message)) {
      errors.push(`pageerror: ${message}`);
    }
  });

  page.on('console', (message) => {
    if (message.type() !== 'error') {
      return;
    }

    const text = message.text();

    if (!isAllowed(text)) {
      errors.push(`console error: ${text}`);
    }
  });

  return {
    async expectNoCriticalErrors() {
      expect(errors, 'No critical browser console or page errors should be emitted').toEqual([]);
      return this;
    },
  };
}

module.exports = {
  attachPageErrorChecks,
};
