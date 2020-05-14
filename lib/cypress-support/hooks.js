/* eslint-disable no-param-reassign */
let fetchPolyfill;

const reset = () => {
  const version = Cypress.config('hasMultipleWPVersions')
    ? Cypress.spec.name.split('/')[0]
    : false;

  cy.resetWP(version);

  cy.log(`WordPress Version: ${version}`);
};

before(() => {
  reset();

  cy.readFile('node_modules/unfetch/dist/unfetch.umd.js').then((content) => {
    fetchPolyfill = content;
  });

  cy.visit('/');
});

beforeEach(() => {
  Cypress.currentTest.retries(2);
});

Cypress.on('uncaught:exception', () => false);

Cypress.on('window:before:load', (win) => {
  delete win.fetch;
  win.eval(fetchPolyfill);
  win.fetch = win.unfetch;
});
