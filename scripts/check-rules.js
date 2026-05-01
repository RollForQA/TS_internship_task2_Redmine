const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const testsDir = path.join(projectRoot, 'tests');
const scanDirs = ['tests', 'pages', 'components', 'support'].map((dir) => path.join(projectRoot, dir));
const failures = [];
const packageJsonPath = path.join(projectRoot, 'package.json');
const testPlanPath = path.join(projectRoot, 'TEST_PLAN.md');

function readFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return readFiles(fullPath);
    }

    return entry.isFile() && entry.name.endsWith('.js') ? [fullPath] : [];
  });
}

for (const file of scanDirs.flatMap(readFiles)) {
  const relative = path.relative(projectRoot, file);
  const content = fs.readFileSync(file, 'utf8');

  if (/waitForTimeout\s*\(|cy\.wait\s*\(\s*\d+|setTimeout\s*\(/.test(content)) {
    failures.push(`${relative}: hard wait is not allowed`);
  }

  if (/\b(test|it|describe)\.only\s*\(/.test(content)) {
    failures.push(`${relative}: focused test is not allowed`);
  }

  if (/\b(test|it|describe)\.skip\s*\(/.test(content)) {
    failures.push(`${relative}: skipped test needs an explicit tracked reason`);
  }

  if (/force:\s*true/.test(content)) {
    failures.push(`${relative}: force:true needs a documented reason`);
  }
}

if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const scripts = packageJson.scripts || {};

  if (!scripts.lint) {
    failures.push('package.json: npm run lint is required');
  }

  if (!scripts.quality || !scripts.quality.includes('npm run lint')) {
    failures.push('package.json: npm run quality must include npm run lint');
  }
} else {
  failures.push('package.json: project scripts are required');
}

const testPlanContent = fs.existsSync(testPlanPath) ? fs.readFileSync(testPlanPath, 'utf8') : '';
const plannedTcIds = new Set([...testPlanContent.matchAll(/\bTC-\d{2}\b/g)].map((match) => match[0]));
const seenTcIds = new Map();

for (const file of readFiles(testsDir)) {
  const relative = path.relative(projectRoot, file);
  const content = fs.readFileSync(file, 'utf8');
  const testTitles = [...content.matchAll(/test\(\s*['"`]([^'"`]+)['"`]/g)].map((match) => match[1]);

  if (/page\.locator\s*\(|page\.getByRole\s*\(|page\.getByLabel\s*\(/.test(content)) {
    failures.push(`${relative}: raw page selectors should stay in POM/components`);
  }

  for (const title of testTitles) {
    if (!/^TC-\d{2}: .+ @(smoke|regression)$/.test(title)) {
      failures.push(`${relative}: invalid test title or primary tag: ${title}`);
    }

    const tcId = title.match(/^TC-\d{2}/)?.[0];

    if (tcId) {
      if (seenTcIds.has(tcId)) {
        failures.push(`${relative}: duplicate TC ID ${tcId}; first seen in ${seenTcIds.get(tcId)}`);
      }

      seenTcIds.set(tcId, relative);

      if (plannedTcIds.size && !plannedTcIds.has(tcId)) {
        failures.push(`${relative}: ${tcId} is missing from TEST_PLAN.md`);
      }
    }

    const tags = title.match(/@(smoke|regression)\b/g) || [];
    if (tags.length !== 1) {
      failures.push(`${relative}: test must have exactly one primary tag: ${title}`);
    }
  }
}

if (!fs.existsSync(testPlanPath)) {
  failures.push('TEST_PLAN.md: coverage matrix is required by the workspace checklist');
}

if (!fs.existsSync(path.join(projectRoot, 'fixtures', 'redmine-data.json'))) {
  failures.push('fixtures/redmine-data.json: reusable test data should be stored in a JSON fixture');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Workspace rule checks passed.');
