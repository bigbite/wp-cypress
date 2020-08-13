const fs = require('fs-extra');

/**
 * If there is no seeds directory, create one with default and examples.
 *
 * @param {string} seedsDir
 * @param {string} packageDir
 */
const createDefaultSeeds = (seedsDir, packageDir) => {
  if (fs.existsSync(seedsDir)) {
    return;
  }

  fs.copySync(`${packageDir}/example-seeds`, seedsDir);
};

module.exports = createDefaultSeeds;
