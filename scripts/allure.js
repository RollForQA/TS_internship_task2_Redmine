const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const defaultWindowsJavaHome = 'C:\\Program Files\\Eclipse Adoptium\\jdk-17.0.18.8-hotspot';
const command = process.argv[2] || 'generate';

function resolveJavaHome() {
  if (process.env.JAVA_HOME) {
    return process.env.JAVA_HOME;
  }

  if (process.platform === 'win32' && fs.existsSync(path.join(defaultWindowsJavaHome, 'bin', 'java.exe'))) {
    return defaultWindowsJavaHome;
  }

  return '';
}

function resolveAllureBin() {
  const executable = process.platform === 'win32' ? 'allure.cmd' : 'allure';
  return path.join(projectRoot, 'node_modules', '.bin', executable);
}

const javaHome = resolveJavaHome();
const env = { ...process.env };

if (javaHome) {
  env.JAVA_HOME = javaHome;
  env.Path = `${path.join(javaHome, 'bin')}${path.delimiter}${env.Path || env.PATH || ''}`;
}

const allureBin = resolveAllureBin();
const args = command === 'open'
  ? ['open', 'allure-report']
  : ['generate', 'allure-results', '--clean', '-o', 'allure-report'];

const result = spawnSync(allureBin, args, {
  cwd: projectRoot,
  env,
  shell: false,
  stdio: 'inherit',
});

process.exit(result.status || 0);
