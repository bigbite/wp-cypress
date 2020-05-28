const fs = require('fs');

const packageConfig = require('../utils/packageConfig');
const copyFolderRecursiveSync = require('../utils/copyFolderRecursiveSync');
const modifySpec = require('./modifySpec');

module.exports = async (_on, config) => {
  const pkgConfig = await packageConfig();
  const validVersions = await pkgConfig.get('validVersions');

  const tempIntegrationFolder = `${__dirname}/tmp`;

  const duplicateTests = async () => {
    if (fs.existsSync(tempIntegrationFolder)) {
      fs.rmdirSync(tempIntegrationFolder, { recursive: true });
    }

    fs.mkdirSync(tempIntegrationFolder);

    const userIntegrationFolder = await pkgConfig.get('userIntegrationFolder');

    if (!userIntegrationFolder) {
      await pkgConfig.save('userIntegrationFolder', config.integrationFolder);
    }

    validVersions.forEach((version) => {
      copyFolderRecursiveSync(
        userIntegrationFolder || config.integrationFolder,
        `${tempIntegrationFolder}`,
        (fileContents, source, target) => modifySpec(fileContents, version, source, target),
      );

      fs.renameSync(
        `${tempIntegrationFolder}/integration`,
        `${tempIntegrationFolder}/${version}`,
      );
    });
  };

  await duplicateTests();

  let baseUrl = 'http://localhost';
  const port = await pkgConfig.get('port');

  if (port) {
    baseUrl = `${baseUrl}:${port}`;
  }

  fs.watch(config.integrationFolder, { recursive: true }, async (_event, fileName) => {
    if (!fileName) {
      return;
    }

    await duplicateTests();
  });

  return {
    ...config,
    baseUrl,
    integrationFolder: tempIntegrationFolder,
  };
};
