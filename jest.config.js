/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  preset: 'ts-jest',
  testMatch: [
    '**/__tests__/**/*.spec.ts',
  ],
}
