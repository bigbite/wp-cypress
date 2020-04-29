const path = require('path');
const shell = require('shelljs');

const createConfig = (userConfig, dir) => {
  const volumes = [
    `${dir}/config/.htacess-sample:/var/www/html/.htaccess`,
    `${dir}/plugin:/var/www/html/wp-content/plugins/wp-cypress`,
    `${process.cwd()}/cypress/seeds:/var/www/html/seeds`,
  ];
  const plugins = [];
  const themes = [];

  if (userConfig.plugins.length > 0) {
    userConfig.plugins.forEach((x) => {
      const location = path.resolve(x);
      plugins.push(location);
      volumes.push(`${location}:/var/www/html/wp-content/plugins/${path.basename(location)}`);
    });
  }

  if (userConfig.themes.length > 0) {
    userConfig.themes.forEach((x) => {
      const location = path.resolve(x);
      themes.push(location);
      volumes.push(`${location}:/var/www/html/wp-content/themes/${path.basename(location)}`);
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

  shell.sed('-i', 'WP_VERSIONS', versions.join(' '), `${dir}/Dockerfile`);

  const dockerComposeFile = shell.ShellString(`
version: '3.7'
services:
  wp:
    depends_on:
      - db
    build: .
    ports:
      - ${userConfig.port || 80}:80
    volumes:
      - wp:/var/www/html ${volumes.map((x) => `
      - ${x}`).join('')}
  db:
    image: mariadb
    environment:
      MYSQL_ALLOW_EMPTY_PASSWORD: 'yes'
    volumes:
      - db:/var/lib/mysql
volumes:
  wp: {}
  db: {}
`);

  dockerComposeFile.to(`${dir}/docker-compose.yml`);

  return {
    ...userConfig,
    plugins,
    themes,
  };
};

module.exports = createConfig;
