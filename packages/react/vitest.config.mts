import { defineConfig } from 'vitest/config'
import { coverageConfig } from '../../vitest.shared.mts'

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/react',
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    name: 'react',
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: coverageConfig('../../coverage/packages/react'),
  },
}))
