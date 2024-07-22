import { resolve } from 'path'
import type { UserConfig } from 'vite'
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';

export default {
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@slate-serializers/html',
      fileName: 'cdn',
    },
  },
  plugins: [
    alias({
      entries: [
        { find: '@slate-serializers/dom', replacement: 'packages/dom/src/index.ts' },
      ]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    })
  ]
} satisfies UserConfig
