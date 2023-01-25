const path = require('path');
const { exec, cli } = require('./exec');
const run = require('./run');

/**
 * Copy a file|folder on the host to the container.
 *
 * @param {string} location
 * @param {string} destination
 * @param {string} logFile
 *
 * @return {Promise<void>}
 */
const copyToContainer = async (location, destination, logFile) => {
  if (destination) {
    const name = path.basename(destination);
    // eslint-disable-next-line no-await-in-loop
    await run(
      async () =>
        exec(
          `docker cp ${location} $(docker ps | awk 'NR > 1 {print $1; exit}'):${destination}`,
          logFile,
        ),
      `Copying ${name}`,
      `Copied ${name}`,
      logFile,
    );
  }
};

/**
 * Copy volumes instead of mounting.
 *
 * @param {Array} volumes
 * @param {boolean} isWpContent
 * @param {object} logFile
 *
 * @return {Promise<void>}
 */
const copyVolumes = async (volumes, isWpContent, logFile) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [i, volume] of volumes.entries()) {
    const [location, destination] = volume.split(':');
    // eslint-disable-next-line no-await-in-loop
    await copyToContainer(location, destination, logFile);

    if (isWpContent && i === 0) {
      // eslint-disable-next-line no-await-in-loop
      await cli('mkdir -p /var/www/html/wp-content/plugins');
    }
  }
};

module.exports = copyVolumes;
