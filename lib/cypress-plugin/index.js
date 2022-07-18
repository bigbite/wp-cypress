const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');

const watchDir = require('../utils/watch-dir');

const { copyDirSync } = require('../utils/copy');
const modifySpec = require('./modifySpec');

module.exports = async (_on, config) => {
  const packageDir = path.resolve(__dirname, '../../');
  const packageConfig = fs.readJsonSync(`${packageDir}/config.json`);

  // Store the duplicated tests in a tmp folder.
  const tempIntegrationFolder = `${packageDir}/tmp`;

  /**
   * Handle duplicating the integration folders for each WP version and apply
   * any necessary modifications to integration files for wp-cypress to work.
   */
  const duplicateTests = () => {
    shell.rm('-rf', tempIntegrationFolder);

    if (!packageConfig.inheritTests) {
      packageConfig.inheritTests = [];
    }

    packageConfig.validVersions.forEach((version) => {
      copyDirSync(
        `${config.integrationFolder}/`,
        `${tempIntegrationFolder}/${version}`,
        (fileContents, source, target) => modifySpec(fileContents, version, source, target),
      );

      packageConfig.inheritTests.forEach((set) => {
        const itemIntegrationFolder = config.integrationFolder.replace(
          'cypress/integration',
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

  return {
    ...config,
    baseUrl: config.baseUrl ? config.baseUrl : baseUrl,
    integrationFolder: hasMultipleWpVersions ? tempIntegrationFolder : config.integrationFolder,
    wordpressVersions: packageConfig.validVersions,
  };
};
