const shell = require('shelljs');
const { wpcli } = require('../../modules/exec');

const run = require('../../modules/run');

/**
 * Execute the WordPress CLI inside the test container.
 *
 * @param {string} command - The command to execute.
 * @param {string} packageDir - Path to the package directory.
 * @param {object} logFile - Instance of `fs.WriteStream` to output `stdout` and `stderr`.
 * @param {boolean} [writeToStdout=false] - Optionally, whether to write the output to `stdout`.
 *
 * @return {Promise<void>} - A Promise that resolves when the command has finished executing.
 */
const wp = async (command, packageDir, logFile, writeToStdout = false) => {
  shell.cd(packageDir);

  await run(
    async () => wpcli(command, logFile),
    `Running wp ${command}`,
    false,
    false,
    true,
    writeToStdout,
  );
};

module.exports = wp;
