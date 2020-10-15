const fs = require('fs-extra');
const shell = require('shelljs');

const { wpcli, cli } = require('../../modules/exec');
const run = require('../../modules/run');

/**
 * Restore WP to it's initial state.
 *
 * @param {String} packageDir - Path to the package directory.
 * @param {Object} logFile - Logfile to output stdout and stderr.
 * @param {Object} options - CLI options.
 */
const softReset = async (packageDir, logFile, options = false) => {
  const config = fs.readJsonSync(`${packageDir}/config.json`);

  const version = (options && typeof options.version === 'string') ? options.version : config.validVersions[0];
  
  shell.cd(packageDir);

  await cli(`bash update.sh ${version} false`, logFile);

  if (config.wpContentVolume && config.uploadsPath) {
    shell.rm('-rf', `${config['wp-content']}/${config.uploadsPath}`);
  }

  await run(
    async () => wpcli(`wp-cypress-set-user 1`, logFile),
    'Set User ID to 1',
    'User ID set',
    logFile,
  );

  await run(
    async () => wpcli(`db import /tmp/db.sql`, logFile),
    'Importing database',
    'Database imported',
    logFile,
  );

  await run(
    async () => wpcli(`core update-db`, logFile),
    'Updating database',
    'Database updated',
    logFile,
  );
};

module.exports = softReset;
