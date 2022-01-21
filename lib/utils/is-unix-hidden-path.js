/**
 * Checks whether a path starts with or contains a hidden file or a folder
 *
 * @param {string} path - The path of the file that needs to be validated
 *
 * @returns {boolean}
 */
const isUnixHiddenPath = (path) => /(^|\/)\.[^/.]/g.test(path);

module.exports = isUnixHiddenPath;
