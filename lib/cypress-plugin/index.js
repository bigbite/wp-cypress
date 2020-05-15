const fs = require('fs');

const packageConfig = require('../utils/packageConfig');
const copyFolderRecursiveSync = require('../utils/copyFolderRecursiveSync');
const modifySpec = require('./modifySpec');

module.exports = async (_on, config) => {
  const pkgConfig = await packageConfig();
  const validVersions = await pkgConfig.get('validVersions');

  const tempIntegrationFolder = `${__dirname}/tmp`;

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
      (fileContents) => modifySpec(fileContents, version),
    );

    fs.renameSync(
      `${tempIntegrationFolder}/integration`,
      `${tempIntegrationFolder}/${version}`,
    );
  });

  // eslint-disable-next-line consistent-return
  return {
    ...config,
    integrationFolder: tempIntegrationFolder,
  };
};
