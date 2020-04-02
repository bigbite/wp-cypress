var unfetch = require('unfetch');

before(() => {
  cy.visit('/')
});

Cypress.on('uncaught:exception', () => false);

Cypress.on('window:before:load', (win) => {
  delete win.fetch;
  win.fetch = unfetch;
});
