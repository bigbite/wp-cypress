/* eslint-disable global-require, import/no-dynamic-require */
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const { get, defaults } = require('lodash');
const Ajv = require('ajv');
const semver = require('semver');

const createDefaultSeeds = require('./createDefaultSeeds');
const getThemeAndPluginData = require('./getThemeAndPluginData');
const renderTemplate = require('./renderTemplate');
const getValidVersions = require('./getValidVersions');

// Initialize the validation object.
const validation = new Ajv({ allErrors: true, jsonPointers: true });
require('ajv-errors')(validation);

// Constants.
const INVALID_WP_CONTENT_PATH_ERROR = 'Path to wp-content is not a directory.';
const WP_CONTENT_EXCLUDE_PATHS = ['uploads', 'upgrade', 'node_modules', 'cypress'];

/**
 * Generate wp-cypress config, Dockerfile and docker-compose.yml.
 *
 * @param {string} packageDir
 * @param {boolean} hasVolumeSupport
 * @return {object}
 */
const createConfig = async (packageDir, hasVolumeSupport = true) => {
  const CWD = process.cwd();

  // eslint-disable-next-line import/no-unresolved
  const { version: cypressVersion } = require('../../../../cypress/package.json');

  let configFile;

  if (semver.gt(cypressVersion, '10.0.0')) {
    configFile = await require(`${CWD}/cypress.config.js`);
  } else {
    configFile = await fs.readJSON(`${CWD}/cypress.json`);
  }

  const { wp = {}, integrationFolder } = configFile;

  const config = defaults(wp, {
    seedsPath: 'cypress/seeds',
    wpContent: false,
    multisite: false,
    url: false,
    phpMemoryLimit: '128M',
  });

  const schema = await fs.readJSON(`${packageDir}/lib/schemas/config-validation.json`);

  if (!validation.validate(schema, config)) {
    throw new Error(
      [
        validation.errors[0].message,
        ...[get(validation.errors[0], 'params.errors[0].message') || ''],
      ].join(', '),
    );
  }

  if (!config.url) {
    config.url = config.port ? `http://localhost:${config.port}` : 'http://localhost';
  }

  let volumes = [];
  let activePlugins = [];
  let activeTheme = false;
  let pluginsActivatedAfterTheme = [];

  if (config.wpContent) {
    const pathToWPContent = path.resolve(config.wpContent.path);

    if (!fs.lstatSync(pathToWPContent).isDirectory()) {
      throw new Error(INVALID_WP_CONTENT_PATH_ERROR);
    }

    const ignore = WP_CONTENT_EXCLUDE_PATHS.map((exclude) => `${pathToWPContent}/${exclude}`);

    if (config.muPlugins) {
      ignore.push(`${pathToWPContent}/mu-plugins`);
    }

    glob.sync(`${pathToWPContent}/*`, { ignore }).forEach((location) => {
      const destination = path.relative(pathToWPContent, location);
      volumes.push(`${location}:/var/www/html/wp-content/${destination}`);
    });

    if (config.wpContent.activePlugins) {
      activePlugins = config.wpContent.activePlugins;
    }

    if (config.wpContent.activeTheme) {
      activeTheme = config.wpContent.activeTheme;
    }

    if (config.wpContent.pluginsActivatedAfterTheme) {
      pluginsActivatedAfterTheme = config.wpContent.pluginsActivatedAfterTheme;
    }
  } else {
    const { plugins, themes } = getThemeAndPluginData(config.plugins, config.themes);

    if (plugins.length > 0) {
      activePlugins = plugins.map((x) => x.name);
    }

    if (themes.length > 0) {
      activeTheme = themes[0].name;
    }

    volumes = [...volumes, ...plugins.map((x) => x.volume), ...themes.map((x) => x.volume)];
  }

  const seedsDir = `${CWD}/${config.seedsPath}`;

  createDefaultSeeds(seedsDir, packageDir);

  volumes.push(
    `${seedsDir}:/var/www/html/seeds`,
    `${packageDir}/plugin:/var/www/html/wp-content/plugins/wp-cypress`,
  );

  if (config.configFile) {
    volumes.push(`${path.resolve(config.configFile)}:/var/www/html/wp-cypress-config.php`);
  }

  if (config.muPlugins && config.muPlugins.path) {
    const muPluginsLocation = path.resolve(config.muPlugins.path);
    const muPluginsDestination = config.muPlugins.vip ? 'client-mu-plugins' : 'mu-plugins';
    volumes.push(`${muPluginsLocation}:/var/www/html/wp-content/${muPluginsDestination}`);
  }

  const version = Array.isArray(config.version) ? config.version : [config.version];
  const validVersions = await getValidVersions(version);

  await renderTemplate(
    `${packageDir}/lib/templates/docker-compose.ejs`,
    `${packageDir}/docker-compose.yml`,
    {
      port: config.port || 80,
      dbPort: config.dbPort || 3306,
      volumes: hasVolumeSupport ? volumes : false,
    },
  );

  let htaccessFile = '.htaccess';

  if (config.multisite === 'subdomain') {
    htaccessFile = `${htaccessFile}-subdomain`;
  } else if (config.multisite) {
    htaccessFile = `${htaccessFile}-subfolder`;
  }

  await renderTemplate(`${packageDir}/lib/templates/dockerfile.ejs`, `${packageDir}/Dockerfile`, {
    isWpContent: config.wpContent,
    versions: validVersions,
    vip: config.muPlugins ? config.muPlugins.vip : false,
    phpVersion: config.phpVersion || 7.4,
    phpMemoryLimit: config.phpMemoryLimit || '128M',
    htaccessFile,
  });

  const wpCypressConfig = {
    ...config,
    version,
    validVersions,
    volumes,
    activePlugins,
    activeTheme,
    pluginsActivatedAfterTheme,
    // We need to store the user integration folder because we replaces cypress's
    // configuration path to the integration folder with a path to the
    // temp integration folder but we still need to be aware of the original.
    userIntegrationFolder: integrationFolder || `${CWD}/cypress/integration`,
  };

  fs.writeJSONSync(`${packageDir}/config.json`, wpCypressConfig);

  return wpCypressConfig;
};

module.exports = createConfig;
