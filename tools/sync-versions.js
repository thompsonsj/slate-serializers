const mainPackageJson = require('../package.json');
const glob = require('glob');
const fs = require('fs');

glob.sync('./packages/**/package.json')
  .forEach(location => {
    const packageJson = JSON.parse(fs.readFileSync(location))
    fs.writeFileSync(location, JSON.stringify({
        ...packageJson,
        version: mainPackageJson.version,
        ...(packageJson.dependencies?.['@slate-serializers/dom'] && {
          dependencies: {
            ...packageJson.dependencies,
            "@slate-serializers/dom": mainPackageJson.version
          }
        }),
    }, null, 3))
  }
);
