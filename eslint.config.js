const js = require('@eslint/js');
const playwright = require('eslint-plugin-playwright');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      'allure-report/**',
      'allure-results/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['tests/**/*.spec.js'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/expect-expect': ['warn', {
        assertFunctionPatterns: ['.*\\.expect.*', 'expect.*'],
      }],
      'playwright/no-conditional-in-test': 'off',
    },
  },
  {
    files: ['scripts/check-rules.js'],
    rules: {
      'no-console': ['error', { allow: ['log', 'warn', 'error'] }],
    },
  },
];
