/* eslint-disable no-param-reassign */
let fetchPolyfill;

Cypress.wp = {};

before(() => {
  const polyfillUrl = 'https://unpkg.com/unfetch/dist/unfetch.umd.js';

  cy.request(polyfillUrl).then((response) => {
    fetchPolyfill = response.body;
  });

  if ( Cypress.config('wp').disableIntegrationClone ) {
    cy.resetWP( Cypress.config('wp').version[0] );
  }
});

Cypress.on('uncaught:exception', () => false);

Cypress.on('window:before:load', (win) => {
  delete win.fetch;
  win.eval(fetchPolyfill);
  win.fetch = win.unfetch;
});
