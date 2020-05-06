const fs = require('fs');
const shell = require('shelljs');

const { wpcli, cli } = require('../utils/exec');
const run = require('../utils/run');
const configureWordPress = require('../modules/configureWordPress');

const reset = async (packageDir, logFile, options) => {
  const config = JSON.parse(fs.readFileSync(`${packageDir}/config.json`, 'utf8'));
  shell.cd(packageDir);

  const version = options || config.version[0];

  console.log('options', options);
  console.log('config', config);
  console.log('VER', version);

  await cli(`bash update.sh ${options.version}`, logFile);

  await run(
    async () => wpcli(`core config \
    --dbhost=db \
    --dbname=wordpress \
    --dbuser=root \
    --dbpass='' \
    --locale=en_US \
    --extra-php <<PHP
  define('FS_METHOD', 'direct');
  define( 'WP_DEBUG', false );
PHP
`, logFile),
    'Creating config',
    'Ready to start testing!',
    logFile,
  );

  await run(
    async () => wpcli('db reset --yes', logFile),
    'Re-setting database',
    'Database Reset',
    logFile,
  );

  const url = config.port ? `http://localhost:${config.port}` : 'http://localhost';

  await run(
    async () => wpcli(
      `core install --url=${url} --title="WP Cypress" --admin_user=admin --admin_password=password --admin_email="admin@test.com" --skip-email`,
      logFile,
    ),
    'Re-installing WordPress',
    'WordPress re-installed',
    logFile,
  );

  await configureWordPress(config, logFile);
};

module.exports = reset;
