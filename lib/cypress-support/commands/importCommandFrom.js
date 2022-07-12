global.importerRegistry = [];

/**
 * Check whether the command target was already imported into registry.
 * @param {string} target
 * @returns
 */
const commandWasImported = (target) => {
  return importerRegistry.filter((e) => e.target === target).length > 0;
};

/**
 * Updates the command importer registry with the required data.
 * @param {object} target
 * @returns
 */
const updateImporterRegistry = (target) => {
  importerRegistry.push(target);

  return target;
};

/**
 * @todo Change target param to handle string or array of strings.
 * @todo Allow usage so does not require promise chain when importing.
 * @param {string} target Target plugin or theme to import.
 * @returns
 */
const importCommandFrom = (target = null) => {
  if (typeof target !== 'string' && !target.every((i) => typeof i === 'string')) {
    throw new Error(`Commands to import should be either a string or an array of strings.`);
  }

  console.log(Cypress);
  console.log(Cypress.config('integrationFolder'));
  console.log(Cypress.eventNames());
  console.log(Cypress.env());

  console.log('------');

  if (commandWasImported(target)) {
    console.log(`${target} already required.`);
    return cy;
  }

  const [type = 'plugins', item] = target.split('/');

  const currentTarget = {
    target,
    type,
    item,
    path: `/${type}/${item}/cypress/support/commands.js`,
    firstCalled: Cypress.spec,
  };

  updateImporterRegistry(currentTarget);

  console.log(currentTarget.path);
  switch (type) {
    case 'plugins':
      require(`/plugins/${item}/cypress/support/commands.js`);
      break;
    case 'themes':
      require(`/themes/${item}/cypress/support/commands.js`);
      break;
    case 'client-mu-plugins':
      // require(`/client-mu-plugins/${item}/cypress/support/commands.js`);
      break;
    case 'mu-plugins':
      // require(`/mu-plugins/${item}/cypress/support/commands.js`);
      break;
  }

  return cy;
};

module.exports = importCommandFrom;
