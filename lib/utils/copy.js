const fs = require('fs-extra');
const path = require('path');
const junk = require('junk');
const isUnixHiddenPath = require('./isUnixHiddenPath');

/**
 * Copy a file and modify it's contents.
 *
 * @param {string} src
 * @param {string} dest
 * @param {function} modifier
 */
const copyFileSync = (src, dest, modifier) => {
  let fileContents = fs.readFileSync(src, { encoding: 'utf8' });

  if (modifier) {
    fileContents = modifier(fileContents, src, dest);
  }

  fs.outputFileSync(dest, fileContents);
};

/**
 * Copy contents of a directory recursively.
 *
 * @param {string} src
 * @param {string} dest
 * @param {function} modifier
 * @param {array} filters
 */
const copyDirSync = (src, dest, modifier = false, filters = []) => {
  if (filters.some((x) => src.includes(x))) {
    return;
  }

  fs.mkdirpSync(dest);

  if (!fs.lstatSync(src).isDirectory()) {
    return;
  }

  fs.readdirSync(src)
    .filter((x) => junk.not(x) && !isUnixHiddenPath(x))
    .forEach((item) => {
      const srcItem = path.join(src, item);
      const destItem = path.join(dest, item);

      if (fs.lstatSync(srcItem).isDirectory()) {
        copyDirSync(srcItem, destItem, modifier, filters);
      } else {
        copyFileSync(srcItem, destItem, modifier);
      }
    });
};

module.exports = {
  copyDirSync,
  copyFileSync,
};
