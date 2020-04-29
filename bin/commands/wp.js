const shell = require('shelljs');
const { wpcli } = require('../utils/exec');

const run = require('../utils/run');

const wp = async (command, packageDir, logFile) => {
  shell.cd(packageDir);

  await run(
    async () => wpcli(command, logFile),
    `Running wp ${command}`,
  );
};

module.exports = wp;
