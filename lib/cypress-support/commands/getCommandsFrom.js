/* eslint-disable import/no-dynamic-require,global-require */
/**
 * COMMAND USAGE:
 *
 * Commands can be loaded into the current tests by adding the plugin
 * or theme as the ${target} parameter as a string;
 * ```js
 * before(() => {
 *   cy.getCommandsFrom('plugins/my-plugin');
 * });
 * ```
 *
 * The command can also accept an array of strings to load in commands
 * from multiple plugins/themes.
 * ```js
 * before(() => {
 *   cy.getCommandsFrom(['plugins/my-plugin', 'themes/my-theme']);
 * });
 * ```
 *
 * If you are getting commands and using them immediately you will
 * need to use the command after a promise;
 * ```js
 * it('should open the editor and run plugin command.', () => {
 *   cy.getCommandsFrom('plugins/my-plugin').then(() => {
 *     cy.myPluginCommand();
 *   });
 * });
 * ```
 *
 */

/**
 * @todo Allow usage so does not require promise chain when
 *       importing before usage.
 * @param {string} targets Target plugin or theme to import.
 * @returns
 */
const getCommandsFrom = (targets = null) => {
  if (typeof targets !== 'string' && !targets.every((i) => typeof i === 'string')) {
    throw new Error(`Commands to import should be either a string or an array of strings.`);
  }

  let commandTargets = targets;

  if (!Array.isArray(commandTargets)) {
    commandTargets = [commandTargets];
  }

  commandTargets.forEach((target) => {
    const [, type, path] = target.match(/([^/]*)\/(.*)/);

    try {
      switch (type) {
        case 'plugins':
          require(`/plugins/${path}/cypress/support/commands.js`);
          break;
        case 'themes':
          require(`/themes/${path}/cypress/support/commands.js`);
          break;
        case 'client-mu-plugins':
          require(`/client-mu-plugins/${path}/cypress/support/commands.js`);
          break;
        case 'mu-plugins':
          require(`/mu-plugins/${path}/cypress/support/commands.js`);
          break;
        default:
          break;
      }
    } catch (e) {
      throw new Error(e);
    }
  });

  return cy;
};

module.exports = getCommandsFrom;
