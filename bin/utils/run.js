const ora = require('ora');
const shell = require('shelljs');

const run = async (command, start, succeed = false, logFile = false) => {
  const spinner = ora({
    text: start,
    prefixText: 'wp-cypress',
  }).start();

  const { code, stdout, stderr } = await command();

  if (code === 1) {
    spinner.fail(stderr);
    if (logFile) {
      shell.echo(`See logs for more info: ${logFile.path}`);
    }
    process.exit(1);
  }

  spinner.succeed(succeed || stdout);
};

module.exports = run;
