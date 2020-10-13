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

  if (config.wpContentVolume && config.uploadsPath) {
    shell.rm('-rf', `${config['wp-content']}/${config.uploadsPath}`);
  }

  await run(
    async () => wpcli(`db export /tmp/db.sql`, logFile),
    'Importing database',
    'Database imported',
    logFile,
  );
};

module.exports = softReset;
