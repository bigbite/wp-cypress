const fs = require('fs-extra');
const shell = require('shelljs');
const { isString } = require('lodash');

const { wpcli, cli } = require('../../modules/exec');
const run = require('../../modules/run');

/**
 * Soft reset by importing database.
 *
 * @param {string} packageDir - Path to the package directory.
 * @param {object} logFile - Instance of `fs.WriteStream` to output `stdout` and `stderr`.
 * @param {object} options - CLI options.
 *
 * @return {Promise<void>}
 */
const softReset = async (packageDir, logFile, options = false) => {
  const config = fs.readJsonSync(`${packageDir}/config.json`);

  const version = options && isString(options.version) ? options.version : config.validVersions[0];

  shell.cd(packageDir);

  await cli(`bash update.sh ${version} false`, logFile);

  await run(
    async () => wpcli('wp-cypress-set-user admin', logFile),
    'Set user to admin',
    'User set to admin',
    logFile,
  );

  await run(
    async () => wpcli('db reset --yes', logFile),
    'Wipe database',
    'Database wiped',
    logFile,
  );

  await run(
    async () => wpcli('db import /tmp/db.sql', logFile),
    'Importing database',
    'Database imported',
    logFile,
  );

  await run(
    async () => wpcli(`core update-db ${
      config.multisite ? '--network' : ''
    }`, logFile),
    'Updating database',
    'Database updated',
    logFile,
  );
};

module.exports = softReset;
