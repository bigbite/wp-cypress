/* eslint-disable no-param-reassign */
let fetchPolyfill;

before(() => {
  cy.resetDB();
  cy.readFile('./node_modules/@bigbite/wp-cypress/node_modules/unfetch/dist/unfetch.umd.js').then((content) => {
    fetchPolyfill = content;
  });
});

beforeEach(() => {
  cy.visit('/');
});

Cypress.on('uncaught:exception', () => false);

Cypress.on('window:before:load', (win) => {
  delete win.fetch;
  win.eval(fetchPolyfill);
  win.fetch = win.unfetch;
});
