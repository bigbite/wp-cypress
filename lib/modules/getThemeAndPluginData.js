const path = require('path');
const glob = require('glob');

/**
 * Retrieve the required plug or theme data from config.
 *
 * @param {string[]} pluginGlobs
 * @param {string[]} themeGlobs
 *
 * @return {{
 *   plugins: Array.<{name: string, path: string, volume: string}>,
 *   themes: Array.<{name: string, path: string, volume: string}>
 * }}
 */
const getThemeAndPluginData = (pluginGlobs = [], themeGlobs = []) => {
  const plugins = [];
  const themes = [];

  pluginGlobs.forEach((x) => {
    const location = path.resolve(x);

    glob.sync(location).forEach((file) => {
      const name = path.basename(file);
      const item = {
        name,
        path: file,
        volume: `${file}:/var/www/html/wp-content/plugins/${name}`,
      };

      if (!plugins.some((y) => y.path === item.path)) {
        plugins.push(item);
      }
    });
  });

  themeGlobs.forEach((x) => {
    const location = path.resolve(x);

    glob.sync(location).forEach((file) => {
      const name = path.basename(file);
      const item = {
        name,
        path: file,
        volume: `${file}:/var/www/html/wp-content/themes/${name}`,
      };

      if (!themes.some((y) => y.path === item.path)) {
        themes.push(item);
      }
    });
  });

  return { plugins, themes };
};

module.exports = getThemeAndPluginData;
