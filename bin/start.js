const fs = require('fs');
const shell = require('shelljs');

const retryCommand = require('./utils/retryCommand');
const createConfig = require('./createConfig');
const { exec, wpcli } = require('./utils/exec');
const run = require('./utils/run');
const configureWordPress = require('./configureWordPress');

const start = async (userConfig, packageDir, logFile) => {
  const configFile = fs.createWriteStream(`${packageDir}/config.json`);
  configFile.write(JSON.stringify(createConfig(userConfig, packageDir)));

  shell.cd(packageDir);

  await run(
    async () => exec(
      'docker-compose down --volumes && docker-compose build && docker-compose up -d',
      logFile,
    ),
    'Creating Test Environment',
    'Test Environment running on port 80',
    logFile,
  );

  await run(
    async () => retryCommand(() => wpcli('core is-installed', logFile), 2000, 30),
    'Downloading & Installing WordPress',
    'WordPress Installed',
    logFile,
  );

  await configureWordPress(configFile.path, logFile);
};

module.exports = start;
