const { map, isString, get } = require('lodash');
const fs = require('fs-extra');
const shell = require('shelljs');

const { wpcli, cli } = require('../../modules/exec');
const run = require('../../modules/run');
const copyVolumes = require('../../modules/copyVolumes');
const getWPInstallType = require('../../modules/getWPInstallType');

/**
 * Restore WP to it's initial state.
 *
 * @param {String} packageDir - Path to the package directory.
 * @param {Object} logFile - Logfile to output stdout and stderr.
 * @param {Object} options - CLI options.
 */
const reset = async (packageDir, logFile, options) => {
  const config = fs.readJsonSync(`${packageDir}/config.json`);

  const version = options && isString(options.version) ? options.version : config.validVersions[0];

  shell.cd(packageDir);

  await cli(`bash update.sh ${version} true`, logFile);

  if (!options.volumes) {
    await copyVolumes(config.volumes, config.wpContent, logFile);
  }

  const locale = get(config, ['locale'], 'en_US');

  await run(
    async () =>
      wpcli(
        `core config --dbhost=db --dbname=wordpress --dbuser=root --dbpass="" --locale=${locale} --extra-php`,
        logFile,
        `

${map(
  config.config,
  (value, key) => `
define( '${key}', ${isString(value) ? `'${value}'` : value} );`,
).join('')}

if ( file_exists( __DIR__ . '/wp-cypress-config.php' ) ) {
  require_once __DIR__ . '/wp-cypress-config.php';
}

if( file_exists ( ABSPATH . '.userid' ) ) {
  function wp_validate_auth_cookie( $cookie='', $scheme='' ) {
    return file_get_contents( ABSPATH . '.userid' );
  }
}
`,
      ),
    'Creating wp-config.php',
    'wp-config.php created',
    logFile,
  );

  await run(
    async () => wpcli('db reset --yes', logFile),
    'Creating database',
    'Database created',
    logFile,
  );

  await run(
    async () =>
      wpcli(
        `core ${getWPInstallType(config.multisite)} --url=${
          config.url
        } --title="WP Cypress" --admin_user=admin --admin_password=password --admin_email="admin@test.com" --skip-email`,
        logFile,
      ),
    'Installing WordPress',
    'WordPress installed',
    logFile,
  );

  if (config.timezone) {
    await run(
      async () => wpcli(`option update timezone_string ${config.timezone}`, logFile),
      'Updating timezone',
      'Timezone updated',
      logFile,
    );
  }

  await run(
    async () =>
      wpcli(
        `plugin activate wp-cypress ${config.activePlugins.join(' ')} ${
          config.multisite ? '--network' : ''
        }`,
        logFile,
      ),
    'Activating plugins',
    'Activated plugins',
    logFile,
    false,
  );

  await run(
    async () => wpcli('wp-cypress-set-user admin', logFile),
    'Set user to admin',
    'User set to admin',
    logFile,
  );

  if (config.activeTheme) {
    await run(
      async () => wpcli(`theme activate ${config.activeTheme}`, logFile),
      `Activating ${config.activeTheme} theme`,
      `Activated ${config.activeTheme} theme`,
      logFile,
      false,
    );
  }

  await run(
    async () => wpcli('seed DefaultUsers', logFile),
    'Creating default users',
    'Default users created',
    logFile,
  );

  await run(
    async () => wpcli('seed DefaultSeeder', logFile),
    'Running default seeder',
    'Default seeder successfully ran',
    logFile,
  );

  shell.rm('-rf', '/tmp/db.sql');

  await run(
    async () => wpcli('db export /tmp/db.sql --add-drop-table', logFile),
    'Exporting database',
    'Database exported',
    logFile,
  );
};

module.exports = reset;
