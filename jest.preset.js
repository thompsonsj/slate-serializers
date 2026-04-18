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
};
