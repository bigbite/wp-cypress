const shell = require('shelljs');

const run = require('../../modules/run');
const { exec } = require('../../modules/exec');

/**
 * Stop and remove the test container.
 * @param {String} packageDir - Path to the package directory.
 * @param {Object} logFile - Logfile to output stdout and stderr.
 */
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
