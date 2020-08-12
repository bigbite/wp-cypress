const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');

const watchDir = require('../utils/watchDir');

const { copyDirSync } = require('../utils/copy');
const modifySpec = require('./modifySpec');

module.exports = async (_on, config) => {
  const packageDir = path.resolve(__dirname, '../../');
  const packageConfig = fs.readJsonSync(`${packageDir}/config.json`);

  /**
   * Watch and listen for changes to wp-content folder, so they are reflected in the
   * container.
   */
  if (packageConfig['wp-content']) {
    const filters = ['node_modules', 'cypress'];

    if (packageConfig.vip) {
      filters.push('mu-plugins');
    }

    watchDir(packageConfig['wp-content'], ((event, fileName) => {
      if (event === 'rename') {
        shell.rm('-rf', `${packageDir}/wp-content/${fileName}`);
      }

      copyDirSync(
        packageConfig['wp-content'],
        `${packageDir}/wp-content`,
        false,
        filters,
      );
    }));
  }

  // Store the duplicated tests in a tmp folder.
  const tempIntegrationFolder = `${packageDir}/tmp`;

  /**
   * Handle duplicating the integration folders for each WP version and apply
   * any necessary modifications to integration files for wp-cypress to work.
   */
  const duplicateTests = () => {
    shell.rm('-rf', tempIntegrationFolder);

    packageConfig.validVersions.forEach((version) => {
      copyDirSync(
        `${config.integrationFolder}/`,
        `${tempIntegrationFolder}/${version}`,
        (fileContents, source, target) => modifySpec(fileContents, version, source, target),
      );
    });
  };

  watchDir(config.integrationFolder, duplicateTests);

  return {
    ...config,
    baseUrl: packageConfig.port ? `http://localhost:${packageConfig.port}` : 'http://localhost',
    integrationFolder: tempIntegrationFolder,
  };
};
