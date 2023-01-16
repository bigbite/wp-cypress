const ora = require('ora');
const shell = require('shelljs');

/**
 * Run a command.
 *
 * @param {function: Promise<{code: number, stdout: string, stderr: string}>} command - A function to execute a command
 *                                                                                      and return a Promise that
 *                                                                                      resolves to an object
 *                                                                                      containing the process exit
 *                                                                                      code, stdout, and stderr.
 * @param {string} start - The message to display when the command starts running.
 * @param {string|false} [succeed=false] - Optionally, a message to display when the command succeeds.
 * @param {object|false} [logFile=false] - Optionally, an instance of `fs.WriteStream` to output `stdout` and `stderr`.
 * @param {boolean} [exitOnError=true] - Optionally, whether to exit the process when the command fails.
 * @param {boolean} [writeToStdout=false] - Optionally, whether to write the output to `stdout`.
 *
 * @return {Promise<void>} - A Promise that resolves when the command has finished running.
 */
const run = async (
  command,
  start,
  succeed = false,
  logFile = false,
  exitOnError = true,
  writeToStdout = false,
) => {
  const spinner = ora({
    text: start,
    prefixText: 'wp-cypress',
  }).start();

  const { code, stdout, stderr } = await command();

  if (code === 127) {
    spinner.fail(stderr);

    if (logFile) {
      shell.echo(`See logs for more info: ${logFile.path}`);
    }

    process.exit(1);
  }

  if (code === 1) {
    if (exitOnError) {
      spinner.fail(stderr);

      if (logFile) {
        shell.echo(`See logs for more info: ${logFile.path}`);
      }

      process.exit(1);
    }

    spinner.warn(stderr);

    return;
  }

  spinner.succeed(succeed || stdout);

  if (writeToStdout) {
    process.stdout.write(succeed || stdout);
  }
};

module.exports = run;
