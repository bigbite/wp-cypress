const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');

const createDefaultSeeds = require('./createDefaultSeeds');
const getThemeOrPluginData = require('./getThemeOrPluginData');
const createDockerComposeFile = require('./createDockerComposeFile');
const getValidVersions = require('./getValidVersions');

const DEFAULT_CONFIG = {
  version: ['5.4'],
  'wp-content': false,
  plugins: [],
  themes: [],
  'mu-plugins': false,
  vip: false,
  config: {},
  port: false,
  timezone: false,
  seedsPath: 'cypress/seeds',
};

/**
 * Generate wp-cypress config, Dockerfile and docker-compose.yml.
 *
 * @param {string} packageDir
 * @return {object}
 */
const createConfig = async (packageDir, volumeSupport = true) => {
  const { wp = {}, integrationFolder } = await fs.readJSON(`${process.cwd()}/cypress.json`);

  const config = {
    ...DEFAULT_CONFIG,
    ...wp,
  };

  const seedsDir = `${process.cwd()}/${config.seedsPath}`;
  const plugins = getThemeOrPluginData(config.plugins, 'plugins');
  const themes = getThemeOrPluginData(config.themes, 'themes');

  createDefaultSeeds(seedsDir, packageDir);

  const pathToWPContent = config['wp-content'] ? path.resolve(config['wp-content']) : false;

  if (pathToWPContent) {
    if (!fs.lstatSync(pathToWPContent).isDirectory()) {
      throw new Error('Path to wp-config is invalid.');
    }
  }

  const volumes = [
    `${packageDir}/config.json:/var/www/html/config.json`,
    `${packageDir}/config/php.ini:/usr/local/etc/php/php.ini`,
    `${packageDir}/config/.htaccess:/var/www/html/.htaccess`,
    `${packageDir}/wp-content:/var/www/html/wp-content`,
    `${packageDir}/plugin:/var/www/html/wp-content/plugins/wp-cypress`,
    `${seedsDir}:/var/www/html/seeds`,
    ...(plugins.map((x) => x.volume)),
    ...(themes.map((x) => x.volume)),
  ];

  if (config['mu-plugins'] && !config.vip) {
    volumes.push(`${path.resolve(config['mu-plugins'])}:/var/www/html/wp-content/mu-plugins`);
  }

  const version = Array.isArray(config.version) ? config.version : [config.version];
  const validVersions = await getValidVersions(version);

  if (volumeSupport == false) {
    createDockerComposeFile(packageDir, config.port, []);
  } else {
    createDockerComposeFile(packageDir, config.port, volumes);
  }

  shell.cp(`${packageDir}/Dockerfile.template`, `${packageDir}/Dockerfile`);
  shell.sed('-i', 'WP_VERSIONS', validVersions.join(' '), `${packageDir}/Dockerfile`);

  const wpCypressConfig = {
    ...config,
    'wp-content': pathToWPContent,
    version,
    validVersions,
    plugins,
    themes,
    volumes,
    // We need to store the user integration folder because we replaces cypress's
    // configuration path to the integration folder with a path to the
    // temp integration folder but we still need to be aware of the original.
    userIntegrationFolder: integrationFolder || `${process.cwd()}/cypress/integration`,
  };

  fs.writeJSONSync(`${packageDir}/config.json`, wpCypressConfig);

  return wpCypressConfig;
};

module.exports = createConfig;
