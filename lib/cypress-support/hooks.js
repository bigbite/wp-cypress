/* eslint-disable no-param-reassign */
let fetchPolyfill;

Cypress.wp = {};

before(() => {
  const polyfillUrl = 'https://unpkg.com/unfetch/dist/unfetch.umd.js';

  cy.request(polyfillUrl).then((response) => {
    fetchPolyfill = response.body;
  });

  const installedWordpressVersions = Cypress.config('wordpressVersions');

  if (installedWordpressVersions.length === 1) {
    cy.resetWP(installedWordpressVersions[0]);
  }
});

Cypress.on('uncaught:exception', () => false);

Cypress.on('window:before:load', (win) => {
  delete win.fetch;
  win.eval(fetchPolyfill);
  win.fetch = win.unfetch;
});
