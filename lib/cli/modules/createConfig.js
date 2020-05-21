const path = require('path');
const shell = require('shelljs');
const glob = require('glob');

const verifyWPVersion = require('./verifyWPVersion');
const createDockerComposeFile = require('./createDockerComposeFile');
const asyncMap = require('../../utils/asyncMap');

const defaultConfig = {
  version: ['5.4'],
  'mu-plugins': false,
  plugins: [],
  themes: [],
  config: {},
  port: false,
  timezone: false,
};

const createConfig = async (userConfig, dir) => {
  const config = {
    ...defaultConfig,
    ...userConfig,
  };

  const volumes = [
    `${dir}/config.json:/var/www/html/config.json`,
    `${dir}/config/php.ini:/usr/local/etc/php/php.ini`,
    `${dir}/config/.htaccess:/var/www/html/.htaccess`,
    `${dir}/plugin:/var/www/html/wp-content/plugins/wp-cypress`,
    `${process.cwd()}/cypress/seeds:/var/www/html/seeds`,
  ];

  const plugins = [];
  const themes = [];

  if (config['mu-plugins']) {
    volumes.push(`${path.resolve(config['mu-plugins'])}:/var/www/html/wp-content/mu-plugins`);
  }

  if ((config.plugins || []).length > 0) {
    config.plugins.forEach((x) => {
      const location = path.resolve(x);

      glob.sync(location).forEach((file) => {
        const plugin = {
          name: path.basename(file),
          path: file,
        };

        if (!plugins.some((y) => y.path === plugin.path)) {
          plugins.push(plugin);
          volumes.push(`${file}:/var/www/html/wp-content/plugins/${plugin.name}`);
        }
      });
    });
  }

  if (config.plugins || [].length > 0) {
    config.themes.forEach((x) => {
      const location = path.resolve(x);

      glob.sync(location).forEach((file) => {
        const theme = {
          name: path.basename(file),
          path: file,
        };

        if (!themes.some((y) => y.path === theme.path)) {
          themes.push(theme);
          volumes.push(`${file}:/var/www/html/wp-content/themes/${theme.name}`);
        }
      });
    });
  }

  shell.cp(`${dir}/Dockerfile.template`, `${dir}/Dockerfile`);

  let versions = [];

  // Version could be an array|string
  if (Array.isArray(config.version)) {
    versions = [...config.version];
  } else {
    versions.push(config.version);
  }

  versions = await asyncMap(versions, async (ver) => {
    const valid = await verifyWPVersion(ver);
    return { ver, valid };
  });

  const validVersions = versions.filter((x) => x.valid).map((x) => x.ver);

  shell.sed('-i', 'WP_VERSIONS', validVersions.join(' '), `${dir}/Dockerfile`);

  createDockerComposeFile(dir, config.port, volumes);

  return {
    ...config,
    version: versions,
    validVersions,
    plugins,
    themes,
  };
};

module.exports = createConfig;
