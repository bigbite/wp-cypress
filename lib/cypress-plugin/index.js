const fs = require('fs');

const createStore = require('../utils/store');
const copyFolderRecursiveSync = require('../utils/copyFolderRecursiveSync');

module.exports = async (_on, config) => {
  const store = await createStore(__dirname, 'settings');

  const packageConfig = JSON.parse(fs.readFileSync(`${__dirname}/../../config.json`, 'utf8'));

  const hasMultipleWPVersions = packageConfig.validVersions.length > 1;

  if (!hasMultipleWPVersions) {
    return;
  }

  const tempIntegrationFolder = `${__dirname}/tmp`;

  if (fs.existsSync(tempIntegrationFolder)) {
    fs.rmdirSync(tempIntegrationFolder, { recursive: true });
  }

  fs.mkdirSync(tempIntegrationFolder);

  const [userIntegrationFolder] = await store.get(['userIntegrationFolder']);

  if (!userIntegrationFolder) {
    await store.save('userIntegrationFolder', config.integrationFolder);
  }

  packageConfig.validVersions.forEach((version) => {
    copyFolderRecursiveSync(userIntegrationFolder || config.integrationFolder, `${tempIntegrationFolder}`);
    fs.renameSync(`${tempIntegrationFolder}/integration`, `${tempIntegrationFolder}/${version}`);
  });

  // eslint-disable-next-line consistent-return
  return {
    ...config,
    hasMultipleWPVersions,
    integrationFolder: tempIntegrationFolder,
  };
};
