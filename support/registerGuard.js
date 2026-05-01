function registerPayload(postData) {
  const params = new URLSearchParams(postData);
  const value = (...names) => {
    for (const name of names) {
      const fieldValue = params.get(name);

      if (fieldValue !== null) {
        return fieldValue.trim();
      }
    }

    return '';
  };

  return {
    login: value('user[login]', 'login'),
    password: value('user[password]', 'password'),
    confirmation: value('user[password_confirmation]', 'password_confirmation', 'confirmation'),
    firstName: value('user[firstname]', 'user[first_name]', 'first_name', 'firstname'),
    lastName: value('user[lastname]', 'user[last_name]', 'last_name', 'lastname'),
    email: value('user[mail]', 'user[email]', 'mail', 'email'),
  };
}

function blockedRegistrationHtml(scenarioName) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head><title>Unsafe registration blocked</title></head>
      <body>
        <div id="content">
          <h2>Register</h2>
          <div id="errorExplanation">
            <h2>Unsafe registration submit blocked</h2>
            <ul><li>The ${scenarioName} scenario tried to send a potentially valid account payload.</li></ul>
          </div>
        </div>
        <div id="footer">Powered by Redmine</div>
      </body>
    </html>`;
}

async function guardInvalidRegisterPost(page, scenarioName, isExpectedInvalidPayload) {
  await page.unroute('**/account/register').catch(() => {});
  await page.route('**/account/register', async (route) => {
    if (route.request().method() !== 'POST') {
      await route.continue();
      return;
    }

    const payload = registerPayload(route.request().postData() || '');

    if (isExpectedInvalidPayload(payload)) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 409,
      contentType: 'text/html',
      body: blockedRegistrationHtml(scenarioName),
    });
  });
}

module.exports = {
  guardInvalidRegisterPost,
  registerPayload,
};
