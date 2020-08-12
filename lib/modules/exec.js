const shell = require('shelljs');

const exec = (cmd, logFile) => new Promise((resolve) => {
  const child = shell.exec(cmd, {
    async: true,
    silent: true,
  }, (code, stdout, stderr) => {
    resolve({ code, stdout, stderr });
  });

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
  cli: (command, logFile) => exec(`docker-compose exec -T wp ${command}`, logFile),
  wpcli: (command, logFile) => exec(`docker-compose exec -T wp wp --allow-root ${command}`, logFile),
};
