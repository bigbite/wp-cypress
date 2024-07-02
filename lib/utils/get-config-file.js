const semver = require('semver');
const fs = require('fs-extra');

const getConfigFile = () => {
  const CWD = process.cwd();

  // eslint-disable-next-line import/no-unresolved,global-require
  const { version: cypressVersion } = require(`${CWD}/node_modules/cypress/package.json`);

  let configFile;

  if (semver.gt(cypressVersion, '10.0.0')) {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    configFile = require(`${CWD}/cypress.config.js`);
  } else {
    configFile = fs.readJSON(`${CWD}/cypress.json`);
  }

  return configFile;
};

module.exports = getConfigFile;
