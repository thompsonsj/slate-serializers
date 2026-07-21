const nxPreset = require('@nx/jest/preset').default;

/**
 * htmlparser2 v11+ and its peer tree (domhandler, domutils, etc.) ship as ESM.
 * Jest must transform these packages (they live under node_modules) so ts-jest can execute them.
 */
const esmDomStackPackages = [
  'boolbase',
  'css-select',
  'css-what',
  'dom-serializer',
  'domelementtype',
  'domhandler',
  'domutils',
  'entities',
  'htmlparser2',
  'nth-check',
].join('|');

module.exports = {
  ...nxPreset,
  transformIgnorePatterns: [
    `/node_modules/(?!(${esmDomStackPackages})/)`,
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/fixtures/**',
    '!src/**/__snapshots__/**',
  ],
  coverageReporters: ['text', 'text-summary', 'lcov', 'html', 'cobertura'],
};
