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
const reset = async (packageDir, logFile, options = false) => {
  const config = fs.readJsonSync(`${packageDir}/config.json`);

  const version = (options && typeof options.version === 'string') ? options.version : config.validVersions[0];

  shell.cd(packageDir);

  await cli(`bash update.sh ${version} true`, logFile);

  const wpConfigKeys = Object.keys(config.config || {});

  await run(
    async () => wpcli(`core config \
    --dbhost=db \
    --dbname=wordpress \
    --dbuser=root \
    --dbpass='' \
    --locale=en_US \
    --extra-php <<PHP
define( 'FS_METHOD', 'direct' ); ${wpConfigKeys.map((key) => `
define( '${key}', ${config.config[key]} );`).join('')}
${config.vip ? `
if ( file_exists( __DIR__ . '/wp-content/vip-config/vip-config.php' ) ) {
  require_once( __DIR__ . '/wp-content/vip-config/vip-config.php' );
}` : ''}
${config.wpContentVolume && config.uploadsPath ? `define( 'UPLOADS', 'wp-content/${config.uploadsPath}' );` : ''}
PHP
`, logFile),
    'Creating wp-config.php',
    'wp-config.php created',
    logFile,
  );

  if (config.wpContentVolume && config.uploadsPath) {
    shell.rm('-rf', `${config['wp-content']}/${config.uploadsPath}`);
  }

  await run(
    async () => wpcli('db reset --yes', logFile),
    'Creating database',
    'Database created',
    logFile,
  );

  const url = config.port
    ? `http://localhost:${config.port}`
    : 'http://localhost';

  await run(
    async () => wpcli(
      `core install --url=${url} --title="WP Cypress" --admin_user=admin --admin_password=password --admin_email="admin@test.com" --skip-email`,
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

  const plugins = config.plugins.map((x) => x.name).join(' ');

  await run(
    async () => wpcli(`plugin activate wp-cypress ${plugins}`, logFile),
    'Activating plugins',
    'Activated plugins',
    logFile,
    false,
  );

  if (config.themes.length > 0) {
    await run(
      async () => wpcli(`theme activate ${config.themes[0].name}`, logFile),
      `Activating ${config.themes[0].name} theme`,
      `Activated ${config.themes[0].name} theme`,
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

  shell.rm('-rf', `/tmp/db.sql`);
  
  await run(
    async () => wpcli(`db export /tmp/db.sql --add-drop-table`, logFile),
    'Exporting database',
    'Database exported',
    logFile,
  );
  
};

module.exports = reset;
