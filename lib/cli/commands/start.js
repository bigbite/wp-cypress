const shell = require('shelljs');

const maybeCopyWPContent = require('../../modules/maybeCopyWPContent');
const retryCommand = require('../../modules/retryCommand');
const createConfig = require('../../modules/createConfig');
const { exec, cli } = require('../../modules/exec');
const copyVolumes = require('../../modules/copyVolumes');
const run = require('../../modules/run');
const reset = require('./reset');

/**
 * Start the docker the test container and wait for the database to be connected.
 * @param {String} packageDir - Path to the package directory.
 * @param {Object} logFile - Logfile to output stdout and stderr.
 */
const start = async (packageDir, options, logFile) => {
  const hasVolumeSupport = options.volumes;

  const config = await createConfig(packageDir, hasVolumeSupport);

  if (!config.wpContentVolume) {
    await maybeCopyWPContent(config, packageDir, logFile);
  }
  
  shell.cd(packageDir);

  if (config.wpContentVolume) {
    shell.rm('-rf', `${config['wp-content']}/plugins/wp-cypress`);
  }

  if (config.wpContentVolume && config.uploadsPath) {
    shell.mkdir('-p', `${config['wp-content']}/${config.uploadsPath}`);
  }
  
  
  if (config.dependencies) {
    await run(
      async () => exec(
        'composer install -d plugin',
        logFile,
      ),
      'Installing dependencies',
      'Dependencies installed',
      logFile,
    );
  }

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

  if (!hasVolumeSupport) {  
    await copyVolumes(config.volumes.slice(0,1), logFile)

    await cli(
      'mkdir -p /var/www/html/wp-content/plugins',
      logFile,
    );

    await copyVolumes(config.volumes.slice(1), logFile);
  }

  await reset(packageDir, logFile);
};

module.exports = start;
