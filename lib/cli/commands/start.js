const shell = require('shelljs');

const retryCommand = require('../modules/retryCommand');
const createConfig = require('../modules/createConfig');
const { exec, cli } = require('../modules/exec');
const run = require('../modules/run');
const packageConfig = require('../../utils/packageConfig');
const reset = require('./reset');

/**
 * Start the docker the test container and wait for the database to be connected.
 * @param {Object} userConfig - Cypress configuration specific to this package.
 * @param {String} packageDir - Path to the package directory.
 * @param {Object} logFile - Logfile to output stdout and stderr.
 */
const start = async (userConfig, packageDir, logFile) => {
  const config = await createConfig(userConfig, packageDir);
  packageConfig(config);

  shell.cd(packageDir);

  await run(
    async () => exec(
      'composer install -d plugin',
      logFile,
    ),
    'Installing dependencies',
    'Dependencies installed',
    logFile,
  );

  await run(
    async () => exec(
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

  await reset(packageDir, logFile, {});
};

module.exports = start;
