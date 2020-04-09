const fs = require('fs');
const path = require('path');

const sleep = require('./utils/sleep');
const { wpcli } = require('./utils/exec');
const run = require('./utils/run');

const configureWordPress = async (configFilePath, logFile) => {
  const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));

  await run(
    async () => wpcli('plugin activate wp-cypress', logFile),
    'Activating WP Cypress plugin',
    'WP Cypress plugin Activated',
    logFile,
  );

  config.plugins.forEach(async (pluginPath) => {
    const pluginName = path.basename(pluginPath);
    await run(
      async () => wpcli(`plugin activate ${pluginName}`, logFile),
      `Activating ${pluginName} plugin`,
      `${pluginName} plugin activated`,
      logFile,
    );
    await sleep(100);
  });

  if (config.themes.length > 0) {
    const themeName = path.basename(config.themes[0]);
    await run(
      async () => wpcli(`plugin activate ${themeName}`, logFile),
      `Activating ${themeName} plugin`,
      `${themeName} plugin activated`,
      logFile,
    );
  }

  await run(
    async () => wpcli('seed Init', logFile),
    'Seeding Database',
    'Database Seeded',
    logFile,
  );
};

module.exports = configureWordPress;
