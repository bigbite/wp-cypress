const fs = require('fs-extra');
const path = require('path');
const rmDirSync = (src) => {
  if (!fs.lstatSync(src).isDirectory()) {
    return;
  }

  fs.readdirSync(src)
    .forEach((item) => {
      const srcItem = path.join(src, item);

      if (fs.lstatSync(srcItem).isDirectory()) {
        rmDirSync(srcItem);
      } else {
        fs.unlinkSync(srcItem);
      }
    });
  fs.rmdirSync(src);
};
module.exports = {
  rmDirSync,
};
