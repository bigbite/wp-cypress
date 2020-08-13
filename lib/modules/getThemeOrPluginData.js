const path = require('path');
const glob = require('glob');

/**
 * Retrieve the required plug or theme data from config.
 *
 * @param {array} globs
 * @param {string} type
 * @returns {array}
 */
const getThemeOrPluginData = (globs, type = 'plugins') => {
  const items = [];

  globs.forEach((x) => {
    const location = path.resolve(x);

    glob.sync(location).forEach((file) => {
      const name = path.basename(file);
      const item = {
        name,
        path: file,
        volume: `${file}:/var/www/html/wp-content/${type}/${name}`,
      };

      if (!items.some((y) => y.path === item.path)) {
        items.push(item);
      }
    });
  });

  return items;
};

module.exports = getThemeOrPluginData;
