const shell = require('shelljs');

const retryCommand = require('../../modules/retryCommand');
const createConfig = require('../../modules/createConfig');
const { exec, cli, wpcli } = require('../../modules/exec');
const run = require('../../modules/run');
const reset = require('./reset');
const getEnv = require('../../modules/getEnv');
/**
 * Start the docker the test container and wait for the database to be connected.
 *
 * @param {string} packageDir - Path to the package directory.
 * @param {object} options - CLI options.
 * @param {object} logFile - Instance of `fs.WriteStream` to output `stdout` and `stderr`.
 *
 * @return {Promise<void>}
 */
const start = async (packageDir, options, logFile) => {
  const config = await createConfig(packageDir, options.volumes);
  const workingDir = getEnv('WORKING_DIR');

  if (getEnv('NO_DOCKER_MODE') !== 'true') {
    await run(
      async () => exec('docker ps -q', logFile),
      'Checking for Docker',
      'Docker found',
      logFile,
    );

    shell.cd(packageDir);

    await run(
      async () =>
        exec(
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
  } else {
    shell.mkdir('-p', `${workingDir}/html`);
    shell.cp(`${packageDir}/update.sh`, `${workingDir}/html`);
    shell.cp(`${packageDir}/config/${config.htaccessFile}`, `${workingDir}/html/.htaccess`);

    const coreDownloads = config.version.map(async (version) =>
      run(
        async () =>
          wpcli(
            `core download --version="${version}" --path="${workingDir}/${version}" --force`,
            logFile,
          ),
        `Downloading WordPress ${version}`,
        `Downloaded WordPress ${version}`,
        logFile,
      ),
    );

    await Promise.all(coreDownloads);

    if (config.wpContent) {
      config.version.forEach((version) => {
        shell.rm('-rf', `${workingDir}/${version}/wp-content`);
      });
    }

    if (config.vip) {
      await run(
        async () =>
          exec(
            `curl https://github.com/Automattic/vip-go-mu-plugins-built/archive/master.zip -L -o /usr/src/vip-mu-plugins.zip && unzip /usr/src/vip-mu-plugins.zip -d ${workingDir}/html/wp-content && cd ${workingDir}/html/wp-content && mv vip-go-mu-plugins-built-master mu-plugins`,
            logFile,
          ),
        'Downloading VIP MU Plugins',
        'Downloaded VIP MU Plugins',
        logFile,
      );
    }
  }

  await reset(packageDir, logFile, options);
};

module.exports = start;
