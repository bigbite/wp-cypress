const shell = require('shelljs');
const { wpcli } = require('../../modules/exec');

const run = require('../../modules/run');

/**
 * Execute the wordpress cli inside the test container.
 * @param {Sting} command - The command to execute.
 * @param {String} packageDir - Path to the package directory.
 * @param {Object} logFile - Logfile to output stdout and stderr.
 */
const wp = async (command, packageDir, logFile) => {
  shell.cd(packageDir);

  await run(
    async () => wpcli(command, logFile),
    `Running wp ${command}`,
  );
};

module.exports = wp;
