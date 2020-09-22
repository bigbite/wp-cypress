const shell = require('shelljs');

const maybeCopyWPContent = require('../../modules/maybeCopyWPContent');
const retryCommand = require('../../modules/retryCommand');
const createConfig = require('../../modules/createConfig');
const { exec, cli } = require('../../modules/exec');
const run = require('../../modules/run');
const reset = require('./reset');

/**
 * Start the docker the test container and wait for the database to be connected.
 * @param {String} packageDir - Path to the package directory.
 * @param {Object} logFile - Logfile to output stdout and stderr.
 */
const start = async (packageDir, options, logFile) => {
  const volumeSupport = options.volumes;

  const config = await createConfig(packageDir, volumeSupport);

  await maybeCopyWPContent(config, packageDir, logFile);

  shell.cd(packageDir);

  await run(
    async () => exec(
      'composer install -d plugin',
      logFile,
    ),
    'Installing dependencies',
    'Dependencies installed',
    logFile,
  );

  await run(
    async () => exec(
      'docker-compose down --volumes && docker-compose build && docker-compose up -d',
      logFile,
    ),
    'Creating test container',
    'Test container created',
    logFile,
  );

  await run(
    async () => retryCommand(() => cli('mysqladmin ping -h"db"', logFile), 2000, 30),
    'Waiting for database connection',
    'Database connected',
    logFile,
  );

  if (volumeSupport == false) {

    await run(
      async () => exec(
        'docker-compose exec -T wp mkdir -p /var/www/html/wp-content/plugins',
        logFile,
      ),
      'Creating folders',
      'Folder created',
      logFile,
    );

    config.volumes.forEach(async (volume) => {
      let parts = volume.split(":");
      await run(
        async () => exec(
          `docker cp ${parts[0]} $(docker ps | awk 'NR > 1 {print $1; exit}'):${parts[1]}`,
          logFile,
        ),
        'Copy folder',
        'Folder copied',
        logFile,
      );
    });
  }

  await reset(packageDir, logFile);
};

module.exports = start;
