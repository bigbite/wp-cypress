const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const semver = require('semver');

const watchDir = require('../utils/watch-dir');

const { copyDirSync } = require('../utils/copy');
const modifySpec = require('./modifySpec');

module.exports = async (_on, config) => {
  const packageDir = path.resolve(__dirname, '../../');
  const packageConfig = fs.readJsonSync(`${packageDir}/config.json`);

  /**
   * Store the duplicated tests in a tmp folder.
   *
   * Cypress 10 has a hardcoded exclusion rule for "**\/node_modules\/**"
   * when working with test specs, so they can never be loaded
   * from that path. Previously our temporary directory was under
   * the path node_modules/@bigbite/wp-cypress/tmp.
   *
   * See https://docs.cypress.io/guides/references/configuration#excludeSpecPattern
   */
  const tempIntegrationFolder = `${config.projectRoot}/tmp`;

  /**
   * Handle duplicating the integration folders for each WP version and apply
   * any necessary modifications to integration files for wp-cypress to work.
   */
  const duplicateTests = () => {
    shell.rm('-rf', tempIntegrationFolder);

    packageConfig.validVersions.forEach((version) => {
      let integrationDir = `${config.integrationFolder}/`;

      if (semver.gt(config.version, '10.0.0')) {
        integrationDir = 'cypress/e2e';
      }

      copyDirSync(
        integrationDir,
        `${tempIntegrationFolder}/${version}`,
        (fileContents, source, target) => modifySpec(fileContents, version, source, target),
      );

      packageConfig.inheritTests.forEach((set) => {
        const itemIntegrationFolder = integrationDir.replace(
          integrationDir,
          `${set}/cypress/integration`,
        );

        copyDirSync(
          `${itemIntegrationFolder}/`,
          `${tempIntegrationFolder}/${version}/${set}`,
          (fileContents, source, target) => modifySpec(fileContents, version, source, target),
        );
      });
    });
  };

  const hasMultipleWpVersions = packageConfig.validVersions.length > 1;

  if (hasMultipleWpVersions) {
    watchDir(config.integrationFolder, duplicateTests);
  }

  const baseUrl = packageConfig.port
    ? `http://localhost:${packageConfig.port}`
    : 'http://localhost';

  const returnedConfig = {
    ...config,
    baseUrl: config.baseUrl ? config.baseUrl : baseUrl,
    wordpressVersions: packageConfig.validVersions,
  };

  if (semver.gt(config.version, '10.0.0')) {
    // @TODO: strip trailing slash from tempIntegrationFolder before template
    // @TODO: strip preceeding slash from config.specPattern before template
    // @TODO: account for specPattern being an array - map over if array.
    returnedConfig.specPattern = hasMultipleWpVersions
      ? `${tempIntegrationFolder}/${config.specPattern}`
      : config.specPattern;
    returnedConfig.resolved.specPattern.value = returnedConfig.specPattern;
    returnedConfig.rawJson.e2e.specPattern = returnedConfig.specPattern;
    returnedConfig.rawJson.specPattern = returnedConfig.specPattern;
  } else {
    returnedConfig.integrationFolder = hasMultipleWpVersions
      ? tempIntegrationFolder
      : config.integrationFolder;
  }

  return returnedConfig;
};
