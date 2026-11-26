export const coverageConfig = (reportsDirectory: string) => ({
  reportsDirectory,
  provider: 'v8' as const,
  reporter: ['text', 'text-summary', 'lcov', 'html', 'cobertura'] as const,
  include: ['src/**/*.{ts,tsx}'],
  exclude: [
    'src/**/*.spec.{ts,tsx}',
    'src/**/*.test.{ts,tsx}',
    'src/**/__tests__/**',
    'src/**/fixtures/**',
    'src/**/__snapshots__/**',
  ],
})
