const fs = require('fs');
const shell = require('shelljs');

const { wpcli } = require('../utils/exec');
const run = require('../utils/run');
const configureWordPress = require('../modules/configureWordPress');

const reset = async (packageDir, logFile, options) => {
  const config = JSON.parse(fs.readFileSync(`${packageDir}/config.json`, 'utf8'));
  shell.cd(packageDir);

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

  if (options.version) {
    await run(
      async () => wpcli(`core update --version=${options.version} ../wordpress-${options.version}.zip`, logFile),
      `Setting WP version to ${options.version}`,
      `WP version set to ${options.version}`,
      logFile,
    );

    await run(
      async () => wpcli('core update-db', logFile),
      'Updating DB',
      'DB updated',
      logFile,
    );
  }

  await configureWordPress(config, logFile);
};

module.exports = reset;
