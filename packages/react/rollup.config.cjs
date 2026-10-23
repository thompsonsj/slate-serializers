const { withNx } = require('@nx/rollup/with-nx');

// These options were migrated by @nx/rollup:convert-to-inferred from project.json
const options = {
  outputPath: '../../dist/packages/react',
  tsConfig: './tsconfig.lib.json',
  project: './package.json',
  main: 'packages/react/src/index.ts',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
  compiler: 'babel',
  assets: [
    {
      glob: 'packages/react/README.md',
      input: '.',
      output: '.',
    },
  ],
  updateBuildableProjectDepsInPackageJson: true,
  buildableProjectDepsInPackageJsonType: 'dependencies',
};

let config = withNx(options, {
  // Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
  // e.g.
  // output: { sourcemap: true },
});

config = require('./rollup.migrated.config.cjs')(config, options);

module.exports = config;
