const testMetadata = {
  'TC-01': {
    epic: 'Public Site',
    feature: 'Home',
    story: 'TC-01 Home overview content',
    tag: 'smoke',
    severity: 'critical',
  },
  'TC-02': {
    epic: 'Public Site',
    feature: 'Project Navigation',
    story: 'TC-02 Project tabs',
    tag: 'smoke',
    severity: 'critical',
  },
  'TC-03': {
    epic: 'Issue Tracking',
    feature: 'Issues List',
    story: 'TC-03 Issues page controls',
    tag: 'regression',
    severity: 'normal',
  },
  'TC-04': {
    epic: 'Public Site',
    feature: 'Global Search',
    story: 'TC-04 Header search variants',
    tag: 'regression',
    severity: 'normal',
  },
  'TC-05': {
    epic: 'Authentication',
    feature: 'Register Validation',
    story: 'TC-05 Register validation',
    tag: 'regression',
    severity: 'critical',
  },
};

function labelsForTitle(title) {
  const tcId = title.match(/^TC-\d{2}/)?.[0];

  return tcId ? testMetadata[tcId] : undefined;
}

module.exports = {
  labelsForTitle,
  testMetadata,
};
