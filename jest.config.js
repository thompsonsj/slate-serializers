const esModules = ['nanoid'].join('|');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  transform: {
    "^.+\\.[tj]s$": "ts-jest"
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!nanoid)"
  ],
  globals: {
    "ts-jest": {
      "tsconfig": {
        "allowJs": true
      }
    }
  },
  testMatch: [
    '**/__tests__/**/*.spec.(ts|tsx)',
  ],
}
