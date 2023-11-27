const shell = require('shelljs');

const run = require('../../modules/run');
const { exec } = require('../../modules/exec');

/**
 * Stop and remove the test container.
 *
 * @param {string} packageDir - Path to the package directory.
 * @param {object} logFile - Instance of `fs.WriteStream` to output `stdout` and `stderr`.
 *
 * @return {Promise<void>} - A Promise that resolves when the test environment has been stopped.
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
