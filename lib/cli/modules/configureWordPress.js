const { wpcli } = require('./exec');
const run = require('./run');

const configureWordPress = async (config, logFile) => {
  if (config.timezone) {
    await run(
      async () => wpcli(`option update timezone_string ${config.timezone}`, logFile),
      'Updating timezone',
      'Timezone updated',
      logFile,
    );
  }

  await run(
    async () => wpcli(`plugin activate wp-cypress ${config.plugins.map((x) => x.name).join(' ')}`, logFile),
    'Activating plugins',
    'Activated plugins',
    logFile,
    false,
  );

  if (config.themes.length > 0) {
    await run(
      async () => wpcli(`theme activate ${config.themes[0].name}`, logFile),
      `Activating ${config.themes[0].name} theme`,
      `Activated ${config.themes[0].name} theme`,
      logFile,
      false,
    );
  }

  await run(
    async () => wpcli('seed DefaultUsers', logFile),
    'Creating default users',
    'Default users created',
    logFile,
  );

  await run(
    async () => wpcli('seed DefaultSeeder', logFile),
    'Running default seeder',
    'Default seeder successfully ran',
    logFile,
  );
};

module.exports = configureWordPress;
