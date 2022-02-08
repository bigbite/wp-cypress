const applyEnvDefaults = (config) => {
  // All env vars will be prefixed with `WP_CYPRESS_`
  const defaults = [
    {
      name: 'WORKING_DIR',
      config: config.wp.workingDir,
      default: '/var/www',
    },
    {
      name: 'NO_DOCKER_MODE',
      config: config.wp.noDocker,
      default: 'false',
    },
    {
      name: 'DB_NAME',
      config: config.wp.dbName,
      default: 'wordpress',
    },
    {
      name: 'DB_USER',
      config: config.wp.dbUser,
      default: 'root',
    },
    {
      name: 'DB_PASS',
      config: config.wp.dbPass,
      default: '',
    },
    {
      name: 'DB_HOST',
      config: config.wp.dbHost,
      default: 'db',
    },
  ];

  defaults.forEach((env) => {
    if (!process.env[`WP_CYPRESS_${env.name}`]) {
      if (env.config) {
        process.env[`WP_CYPRESS_${env.name}`] = env.config;
      } else {
        process.env[`WP_CYPRESS_${env.name}`] = env.default;
      }
    }
  });
};

module.exports = applyEnvDefaults;
