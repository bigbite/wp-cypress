#!/usr/bin/env node

// Dependencies
const fs = require('fs');
const { program } = require('commander');

// Config
const { version, name } = require('../package.json');
// eslint-disable-next-line import/no-dynamic-require
const userConfig = require(`${process.cwd()}/cypress.json`).wp;
const packageDir = `${process.cwd()}/node_modules/${name}`;
const logFile = fs.createWriteStream(`${packageDir}/debug.log`);

// Commands
const start = require('./start');
const stop = require('./stop');
const resetDB = require('./resetDB');
const wp = require('./wp');

program
  .version(version)
  .arguments('<command>');

program
  .command('start')
  .description('Start a test environment')
  .action(() => start(userConfig, packageDir, logFile));

program
  .command('stop')
  .description('Stop any running containers')
  .action(() => stop(packageDir, logFile));

program
  .command('resetDB')
  .description('Restore the database to it\'s initial state')
  .action(() => resetDB(packageDir, logFile));

program
  .command('wp <command>')
  .description('Execute the WordPress CLI in the running container')
  .action((command) => wp(command, packageDir, logFile));

program.parse(process.argv);
