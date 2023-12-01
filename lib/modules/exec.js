const shell = require('shelljs');
const getEnv = require('./getEnv');

/**
 * Execute a command.
 *
 * @param {string} cmd - The command to execute.
 * @param {object} [logFile] - Optionally, an instance of `fs.WriteStream` to output `stdout` and `stderr`.
 * @param {string} [stdin] - Optionally, input to pass to the command.
 *
 * @return {Promise<{code: number, stdout: string, stderr: string}>} - A Promise that resolves to an object containing
 *                                                                     the process exit code, stdout, and stderr.
 */
const exec = (cmd, logFile, stdin) =>
  new Promise((resolve) => {
    let child;
    if (stdin) {
      child = new shell.ShellString(stdin).exec(
        cmd,
        {
          async: true,
          silent: false,
        },
        (code, stdout, stderr) => {
          resolve({ code, stdout, stderr });
        },
      );
    } else {
      child = shell.exec(
        cmd,
        {
          async: true,
          silent: false,
        },
        (code, stdout, stderr) => {
          resolve({ code, stdout, stderr });
        },
      );
    }

    if (!logFile) {
      return;
    }

    child.stdout.on('data', (data) => {
      logFile.write(`[${new Date().toISOString()}] stdout: ${data} \n`);
    });

    child.stderr.on('data', (data) => {
      logFile.write(`[${new Date().toISOString()}] stderr: ${data} \n`);
    });

    child.on('close', (code) => {
      if (code > 0) {
        logFile.write(`[${new Date().toISOString()}] Exited with code ${code} \n`);
      }
    });
  });

const cli = (command, logFile, stdin) => {
  const workingDir = getEnv('WORKING_DIR');

  if (getEnv('NO_DOCKER_MODE') === 'true') {
    return exec(`cd ${workingDir}/html && ${command}`, logFile, stdin);
  }

  return exec(`docker-compose exec -T wp ${command}`, logFile, stdin);
};

const wpcli = (command, logFile, stdin) => {
  const workingDir = getEnv('WORKING_DIR');

  if (getEnv('NO_DOCKER_MODE') === 'true') {
    return exec(`cd ${workingDir}/html && wp --allow-root ${command}`, logFile, stdin);
  }

  return exec(`docker-compose exec -T wp wp --allow-root ${command}`, logFile, stdin);
};

module.exports = {
  exec,
  cli,
  wpcli,
};
