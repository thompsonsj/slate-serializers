const mainPackageJson = require('../package.json')
const glob = require('glob')
const fs = require('fs')

/**
 * Legacy helper to keep package versions aligned in this repo.
 *
 * `release-please` is the source of truth for package versions (see `.release-please-manifest.json`).
 * This script remains as an explicit, manual tool. It intentionally skips packages that are not
 * linked to the main release train (e.g. `@slate-serializers/tests`).
 */

const SKIP = new Set(['packages/tests/package.json'])

glob
  .sync('./packages/**/package.json')
  .filter((location) => !SKIP.has(location))
  .forEach((location) => {
    const packageJson = JSON.parse(fs.readFileSync(location))
    fs.writeFileSync(
      location,
      JSON.stringify(
        {
          ...packageJson,
          version: mainPackageJson.version,
          ...(packageJson.dependencies?.['@slate-serializers/dom'] && {
            dependencies: {
              ...packageJson.dependencies,
              '@slate-serializers/dom': mainPackageJson.version,
            },
          }),
        },
        null,
        3,
      ),
    )
  })
