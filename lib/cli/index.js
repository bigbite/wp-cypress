const fs = require('fs');
const { program } = require('commander');

const { version, name } = require('../../package.json');

const packageDir = `${process.cwd()}/node_modules/${name}`;
const logFile = fs.createWriteStream(`${packageDir}/debug.log`);

const start = require('./commands/start');
const stop = require('./commands/stop');
const reset = require('./commands/reset');
const wp = require('./commands/wp');

program
  .version(version)
  .arguments('<command>');

program
  .command('start')
  .description('Start a test environment')
  .option('--no-volumes')
  .action((options) => start(packageDir, options, logFile));

program
  .command('stop')
  .description('Stop any running containers')
  .action(() => stop(packageDir, logFile));

program
  .command('reset')
  .description('Reset the installation to it\'s initial state')
  .option('-v,--version <version>')
  .action((options) => reset(packageDir, logFile, options));

program
  .command('wp <command>')
  .description('Execute the WordPress CLI in the running container')
  .action((command) => wp(command, packageDir, logFile));

program.parse(process.argv);
