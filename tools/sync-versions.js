const mainPackageJson = require('../package.json');
const glob = require('glob');
const fs = require('fs');

glob.sync('./packages/**/package.json')
  .forEach(location =>
    fs.writeFileSync(location, JSON.stringify({
        ...JSON.parse(fs.readFileSync(location)),
        version: mainPackageJson.version
    }, null, 3))
  );