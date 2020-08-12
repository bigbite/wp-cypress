const fs = require('fs');
const shell = require('shelljs');

const { exec } = require('./exec');
const run = require('./run');
const { copyDirSync } = require('../utils/copy');

const maybeCopyWPContent = async (config, packageDir, logFile = false) => {
  shell.rm('-rf', `${packageDir}/wp-content`);

  const filters = ['node_modules', 'cypress'];

  if (config.vip) {
    filters.push('mu-plugins');
  }

  if (config['wp-content']) {
    copyDirSync(
      config['wp-content'],
      `${packageDir}/wp-content`,
      false,
      filters,
    );
  }

  if (config.vip && !fs.existsSync(`${packageDir}/wp-content/mu-plugins`)) {
    await run(
      async () => exec(
        `git clone git@github.com:Automattic/vip-go-mu-plugins-built.git ${packageDir}/wp-content/mu-plugins/`,
        logFile,
      ),
      'Installing VIP mu plugins',
      'VIP mu plugins installed',
      logFile,
    );
  }
};

module.exports = maybeCopyWPContent;
