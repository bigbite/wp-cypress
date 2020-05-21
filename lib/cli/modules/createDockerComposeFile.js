const shell = require('shelljs');

const createDockerComposeFile = (dir, port, volumes) => {
  const dockerComposeFile = shell.ShellString(`
version: '3.7'
services:
  wp:
    depends_on:
      - db
    build: .
    ports:
      - ${port || 80}:80
    volumes:
      - wp:/var/www/html ${volumes.map((x) => `
      - ${x}`).join('')}
  db:
    image: mariadb
    environment:
      MYSQL_ALLOW_EMPTY_PASSWORD: 'yes'
      MYSQL_DATABASE: 'wordpress'
    volumes:
      - db:/var/lib/mysql
volumes:
  wp: {}
  db: {}
`);

  dockerComposeFile.to(`${dir}/docker-compose.yml`);
};

module.exports = createDockerComposeFile;
