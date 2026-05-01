function buildFakeUser(fakeUser, suffix = 'negative') {
  return {
    login: `${fakeUser.loginPrefix}_${Date.now()}_${suffix}`,
    firstName: fakeUser.firstName,
    lastName: fakeUser.lastName,
    email: fakeUser.email,
  };
}

module.exports = {
  buildFakeUser,
};
