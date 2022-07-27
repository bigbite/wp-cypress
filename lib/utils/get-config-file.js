const semver = require('semver');
const fs = require('fs-extra');

const getConfigFile = () => {
   const CWD = process.cwd();

  // eslint-disable-next-line import/no-unresolved
  const { version: cypressVersion } = require('../../../../cypress/package.json');

  let configFile;

  if (semver.gt(cypressVersion, '10.0.0')) {
    configFile = require(`${CWD}/cypress.config.js`);
  } else {
    configFile = fs.readJSON(`${CWD}/cypress.json`);
  }

  return configFile;
};

module.exports = getConfigFile;
