/* eslint-disable no-param-reassign */
const esprima = require('esprima');
const escodegen = require('escodegen');
const path = require('path');

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
 * @param {String} version - Wp version spec to be ran in
 * @param {String} source - Origional source of spec file
 * @param {String} target - New target source for spec file.
 * @returns {String} - New spec file with added before block
 */
module.exports = (fileContents, version, source, target) => {
  const re = /(?:\.([^.]+))?$/;

  // Only parse the following files.
  if (!['js', 'jsx', 'ts', 'tsx'].includes(re.exec(source)[0])) {
    return fileContents;
  }

  const beforeBlock = esprima.parseScript(`
    before(() => {
      const path = require('path');
      const relative = __filename.substr(1);
      const integrationFolder = Cypress.config('integrationFolder');
      const absolute = path.join(Cypress.config('projectRoot'), __filename);
      const name = absolute.replace(integrationFolder + '/', '');

      Cypress.spec = { absolute, name, relative };
      Cypress.wp = { version: Cypress.spec.name.split('/')[0] };
      cy.resetWP();
    });
  `).body[0];

  console.log(fileContents);

  const parsed = esprima.parseModule(fileContents);

  const parsedFileWithInsert = {
    ...parsed,
    body: parsed.body.map((block) => {
      if (block.type === 'ImportDeclaration') {
        if (block.source.value !== path.basename(block.source.value)) {
          const absolutePathToModule = path.resolve(path.dirname(source), block.source.value);
          const newRelativePath = path.relative(path.dirname(target), absolutePathToModule);
          block.source.value = newRelativePath;
          block.source.raw = newRelativePath;
          return block;
        }
      }

      if (!block.expression) {
        return block;
      }

      if (!block.expression.callee) {
        return block;
      }

      if (!block.expression.callee.name) {
        return block;
      }

      if (
        block.expression.callee.name === 'describe' ||
        block.expression.callee.name === 'context'
      ) {
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
