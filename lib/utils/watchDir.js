const fs = require('fs-extra');

const watchDir = (dir, callback) => {
  callback('load', dir);

  fs.watch(dir, { recursive: true }, async (event, fileName) => {
    if (!fileName) {
      return;
    }

    callback(event, fileName);
  });
};

module.exports = watchDir;
