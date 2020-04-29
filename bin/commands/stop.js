const shell = require('shelljs');

const run = require('../utils/run');
const { exec } = require('../utils/exec');

const stop = async (packageDir, logFile) => {
  shell.cd(packageDir);

  await run(
    async () => exec('docker-compose down --volumes', logFile),
    'Stopping Test Environment',
    'Test Environment stopped',
    logFile,
  );
};

module.exports = stop;
