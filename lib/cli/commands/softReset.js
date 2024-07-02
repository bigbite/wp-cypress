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
    async () => wpcli(`wp-cypress-set-user ${config.adminUsername}`, logFile),
    `Set user to  ${config.adminUsername}`,
    `User set to  ${config.adminUsername}`,
    logFile,
  );

  // When dealing with multisite:
  // 'db reset' will drop all tables including wp_blogs and wp_sitemeta which will break the multisite setup
  // 'site delete' will delete only the site tables, but can't be used on the root site
  // 'site empty' will remove the site content but not options, users, etc.
  // @wordpress/env clean function does a fresh install of the site
  // woocommerce core has a dedicated plugin (woocommerce-reset) providing a REST endpoint to reset the site
  if (config.multisite) {
    const sites = await wpcli('site list --field=url', logFile);
    const siteUrls = sites.stdout.split('\n').filter(Boolean);
    siteUrls.forEach(async (siteUrl) => {
      await run(
        async () => wpcli(`site empty --url=${siteUrl} --yes`, logFile),
        `Deleting site ${siteUrl}`,
        `Site ${siteUrl} deleted`,
        logFile,
      );
    });
  } else {
    await run(
      async () => wpcli('db reset --yes', logFile),
      'Wipe database',
      'Database wiped',
      logFile,
    );
  }

  await run(
    async () => wpcli('db import /tmp/db.sql', logFile),
    'Importing database',
    'Database imported',
    logFile,
  );

  await run(
    async () => wpcli(`core update-db ${config.multisite ? '--network' : ''}`, logFile),
    'Updating database',
    'Database updated',
    logFile,
  );
};

module.exports = softReset;
