const { exec } = require('./exec');

const copyVolumes = async (volumes, logFile) => {
  volumes.forEach(async (volume) => {
    const [location, destination] = volume.split(':');

    await exec(
      `docker cp ${location} $(docker ps | awk 'NR > 1 {print $1; exit}'):${destination}`,
      logFile,
    );
  });
};

module.exports = copyVolumes;
