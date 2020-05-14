const path = require('path');
const shell = require('shelljs');
const glob = require('glob');

const verifyWPVersion = require('./verifyWPVersion');
const createDockerComposeFile = require('./createDockerComposeFile');
const asyncMap = require('../../utils/asyncMap');

const createConfig = async (userConfig, dir) => {
  const volumes = [
    `${dir}/config.json:/var/www/html/config.json`,
    `${dir}/config/php.ini:/usr/local/etc/php/php.ini`,
    `${dir}/config/.htaccess:/var/www/html/.htaccess`,
    `${dir}/plugin:/var/www/html/wp-content/plugins/wp-cypress`,
    `${process.cwd()}/cypress/seeds:/var/www/html/seeds`,
  ];

  const plugins = [];
  const themes = [];

  if (userConfig.plugins.length > 0) {
    userConfig.plugins.forEach((x) => {
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

  if (userConfig.themes.length > 0) {
    userConfig.themes.forEach((x) => {
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
  if (Array.isArray(userConfig.version)) {
    versions = [...userConfig.version];
  } else {
    versions.push(userConfig.version);
  }

  versions = await asyncMap(versions, async (ver) => {
    const valid = await verifyWPVersion(ver);
    return { ver, valid };
  });

  const validVersions = versions.filter((x) => x.valid).map((x) => x.ver);

  shell.sed('-i', 'WP_VERSIONS', validVersions.join(' '), `${dir}/Dockerfile`);

  createDockerComposeFile(dir, userConfig.port, volumes);

  return {
    ...userConfig,
    version: versions,
    validVersions,
    plugins,
    themes,
  };
};

module.exports = createConfig;
