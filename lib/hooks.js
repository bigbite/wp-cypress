/* eslint-disable no-param-reassign */
const unfetch = require('unfetch');

before(() => {
  cy.resetDB();
  cy.visit('/');
});

Cypress.on('uncaught:exception', () => false);

Cypress.on('window:before:load', (win) => {
  delete win.fetch;
  win.fetch = unfetch;
});
