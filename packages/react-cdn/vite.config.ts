import { resolve } from 'path'
import type { UserConfig } from 'vite'
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';

export default {
  build: {
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        'react-dom',
      ],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
      },
    },
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@slate-serializers/react',
      fileName: 'cdn',
    },
  },
  plugins: [
    alias({
      entries: [
        { find: '@slate-serializers/dom', replacement: resolve(__dirname, '../dom/src/index.ts' ) },
        { find: '@slate-serializers/react', replacement: resolve(__dirname, '../react/src/index.ts' ) },
      ]
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    })
  ]
} satisfies UserConfig
