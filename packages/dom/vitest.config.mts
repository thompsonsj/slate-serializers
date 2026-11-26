import { defineConfig } from 'vitest/config'
import { coverageConfig } from '../../vitest.shared.mts'

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/dom',
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    name: 'dom',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: coverageConfig('../../coverage/packages/dom'),
  },
}))
