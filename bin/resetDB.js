const shell = require('shelljs');
const { wpcli } = require('./utils/exec');
const run = require('./utils/run');
const configureWordPress = require('./configureWordPress');

const resetDB = async (packageDir, logFile) => {
  shell.cd(packageDir);

  await run(
    async () => wpcli('db reset --yes', logFile),
    'Re-setting database',
    'Database Reset',
    logFile,
  );

  await run(
    async () => wpcli(
      'core install --url=http://localhost --title="WP Cypress" --admin_user=admin --admin_password=password --admin_email="admin@test.com" --skip-email',
      logFile,
    ),
    'Re-installing WordPress',
    'WordPress re-installed',
    logFile,
  );

  await configureWordPress(`${packageDir}/config.json`, logFile);
};

module.exports = resetDB;
