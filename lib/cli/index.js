const fs = require('fs');
const { program } = require('commander');

require('pretty-error').start();

const { version, name } = require('../../package.json');

const packageDir = `${process.cwd()}/node_modules/${name}`;
const logFile = fs.createWriteStream(`${packageDir}/debug.log`, {
  flags: 'a',
});

const start = require('./commands/start');
const stop = require('./commands/stop');
const reset = require('./commands/reset');
const softReset = require('./commands/softReset');
const wp = require('./commands/wp');

program.version(version).arguments('<command>');

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
  .description("Hard reset the installation to it's initial state")
  .option('-v,--version <version>')
  .action((options) => reset(packageDir, logFile, options));

program
  .command('soft-reset')
  .description("Soft reset the installation to it's initial state")
  .option('-v,--version <version>')
  .action((options) => softReset(packageDir, logFile, options));

program
  .command('wp <command>')
  .description('Execute the WordPress CLI in the running container')
  .action((command) => wp(command, packageDir, logFile));

program
  .command('seed')
  .description('Execute WordPress CLI seed command.')
  .option('<seeder>', 'The name of the seeder to run.')
  .option('-cf, --clean-first', 'Whether to run the clean routine before seeding.')
  .option('-c, --clean', 'Run only the seeder clean routine.')
  .action((options) => {
    let cleanFlag = '';

    if (options.cleanFirst) {
      cleanFlag = '--clean-first';
    } else if (options.clean) {
      cleanFlag = '--clean';
    }

    wp(`seed ${options.args.join(' ')} ${cleanFlag}`, packageDir, logFile);
  });

program.parse(process.argv);
