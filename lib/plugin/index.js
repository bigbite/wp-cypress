const fs = require('fs');

const copyFolderRecursiveSync = require('../utils/copyFolderRecursiveSync');

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  console.log('WOOOOHOOO');
  const configuration = JSON.parse(fs.readFileSync(config.configFile, 'utf8'));

  console.log(configuration);

  if (!Array.isArray(configuration.wp.version)) {
    return;
  }

  const tempIntegrationFolder = `${config.projectRoot}/cypress/tmp`;

  if (fs.existsSync(tempIntegrationFolder)) {
    fs.rmdirSync(tempIntegrationFolder, { recursive: true });
  }

  fs.mkdirSync(tempIntegrationFolder);

  configuration.wp.version.forEach((version) => {
    copyFolderRecursiveSync(config.integrationFolder, `${tempIntegrationFolder}`);
    fs.renameSync(`${tempIntegrationFolder}/integration`, `${tempIntegrationFolder}/${version}`);
  });

  // eslint-disable-next-line consistent-return
  return {
    ...config,
    integrationFolder: tempIntegrationFolder,
  };
};
