const shell = require('shelljs');

const retryCommand = require('../../modules/retryCommand');
const createConfig = require('../../modules/createConfig');
const { exec, cli } = require('../../modules/exec');
const run = require('../../modules/run');
const reset = require('./reset');

/**
 * Start the docker the test container and wait for the database to be connected.
 *
 * @param {string} packageDir - Path to the package directory.
 * @param {object} options - CLI options.
 * @param {object} logFile - Instance of `fs.WriteStream` to output `stdout` and `stderr`.
 *
 * @return {Promise<void>}
 */
const start = async (packageDir, options, logFile) => {
  const config = await createConfig(packageDir, options.volumes);

  await run(
    async () => exec('docker ps -q', logFile),
    'Checking for Docker',
    'Docker found',
    logFile,
  );

  if (config.wpContent) {
    shell.rm('-rf', `${config.wpContent.path}/plugins/wp-cypress`);
  }

  shell.cd(packageDir);

  await run(
    async () =>
      exec(
        'docker-compose down --volumes && docker-compose build && docker-compose up -d',
        logFile,
      ),
    'Creating test container',
    'Test container created',
    logFile,
  );

  await run(
    async () => retryCommand(() => cli('mysqladmin ping -h"db"', logFile), 2000, 30),
    'Waiting for database connection',
    'Database connected',
    logFile,
  );

  await reset(packageDir, logFile, options);
};

module.exports = start;
