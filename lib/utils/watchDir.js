const chokidar = require('chokidar');

const watchDir = (dir, callback) => {
  callback('load', dir);

  const watcher = chokidar.watch(dir, {});

  watcher.on('all', async (event, path) => {
    if (!path) {
      return;
    }

    callback(event, path);
  });
};

module.exports = watchDir;
