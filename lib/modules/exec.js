const shell = require('shelljs');

const exec = (cmd, logFile, stdin) => new Promise((resolve) => {
  let child;
  if (stdin) {
    child = new shell.ShellString(stdin).exec(cmd, {
      async: true,
      silent: true,
    }, (code, stdout, stderr) => {
      resolve({ code, stdout, stderr });
    });
  } else {
    child = shell.exec(cmd, {
      async: true,
      silent: true,
    }, (code, stdout, stderr) => {
      resolve({ code, stdout, stderr });
    });
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
    logFile.write(`[${new Date().toISOString()}] Exited with code ${code} \n`);
  });
});

module.exports = {
  exec,
  cli: (command, logFile, stdin) => exec(`docker-compose exec -T wp ${command}`, logFile, stdin),
  wpcli: (command, logFile, stdin) => exec(`docker-compose exec -T wp wp --allow-root ${command}`, logFile, stdin),
};
