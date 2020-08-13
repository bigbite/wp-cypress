/* eslint-disable no-param-reassign */
let fetchPolyfill;

Cypress.wp = {};

before(() => {
  const polyfillUrl = 'https://unpkg.com/unfetch/dist/unfetch.umd.js';

  cy.request(polyfillUrl).then((response) => {
    fetchPolyfill = response.body;
  });
});

beforeEach(() => {
  Cypress.currentTest.retries(2);
  cy.visit('/');
});

Cypress.on('uncaught:exception', () => false);

Cypress.on('window:before:load', (win) => {
  delete win.fetch;
  win.eval(fetchPolyfill);
  win.fetch = win.unfetch;
});
