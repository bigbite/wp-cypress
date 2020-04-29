/* eslint-disable no-param-reassign */
let fetchPolyfill;

before(() => {
  const version = Cypress.spec.name.split('/')[0];
  console.log(version);
  cy.resetWP(version);

  cy.readFile('node_modules/unfetch/dist/unfetch.umd.js').then((content) => {
    fetchPolyfill = content;
  });
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
