const fs = require('fs');
const shell = require('shelljs');

const { wpcli } = require('./utils/exec');
const run = require('./utils/run');
const configureWordPress = require('./configureWordPress');

const resetDB = async (packageDir, logFile) => {
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

  await configureWordPress(config, logFile);
};

module.exports = resetDB;
