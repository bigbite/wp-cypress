const ora = require('ora');
const shell = require('shelljs');

const run = async (command, start, succeed = false, logFile = false, exitOnError = true) => {
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
};

module.exports = run;
