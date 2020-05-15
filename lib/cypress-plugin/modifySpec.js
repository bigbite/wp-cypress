/* eslint-disable no-param-reassign */
const esprima = require('esprima');
const escodegen = require('escodegen');

/**
 * Add required logic and modifications to spec files.
 *
 * Includes Workaround for incorrect Spec being set in `All Specs`:
 *
 * Inserts a before block in each describe block.
 * The before block sets the correct spec file which will be used in all
 * cases. To ensure consistency, we do this every time, even when not using
 * `All Specs`.
 *
 * @see https://github.com/cypress-io/cypress/issues/3090
 *
 * @param {String} fileContents - Contents of spec file
 * @returns {String} - New spec file with added before block
 */
module.exports = (fileContents, version) => {
  const beforeBlock = esprima.parseScript(`
    before(() => {
      const path = require('path');
      const relative = __filename.substr(1);
      const integrationFolder = Cypress.config('integrationFolder');
      const absolute = path.join(Cypress.config('projectRoot'), __filename);
      const name = absolute.replace(integrationFolder + '/', '');

      Cypress.spec = { absolute, name, relative };

      const version = Cypress.spec.name.split('/')[0];
      cy.resetWP(version);
      cy.visit('/');
    });
  `).body[0];

  const parsed = esprima.parseScript(fileContents);

  const parsedFileWithInsert = {
    ...parsed,
    ...parsed.body.map((block) => {
      if (block.expression.callee.name === 'describe') {
        block.expression.arguments[0].value = `[${version}] ${block.expression.arguments[0].value}`;
        block.expression.arguments[0].raw = `[${version}] ${block.expression.arguments[0].value}`;
        block.expression.arguments[1].body.body = [
          beforeBlock,
          ...block.expression.arguments[1].body.body,
        ];
      }
      return block;
    }),
  };

  return escodegen.generate(parsedFileWithInsert);
};
