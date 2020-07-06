require('./hooks');
require('./setSelection');

const commands = {
  wp(command) {
    cy.exec(`node_modules/.bin/wp-cypress wp "${command}"`);
  },

  seed(seed) {
    cy.exec(`node_modules/.bin/wp-cypress wp "seed ${seed}"`);
  },

  resetWP(version = false) {
    const wpVersion = version || (Cypress.wp || {}).version || false;
    cy.exec(`node_modules/.bin/wp-cypress reset ${wpVersion ? `--version="${wpVersion}"` : ''}`);
  },

  installTheme(name) {
    cy.exec(`node_modules/.bin/wp-cypress wp "theme install ${name}"`);
  },

  activateTheme(name) {
    cy.exec(`node_modules/.bin/wp-cypress wp "theme activate ${name}"`);
  },

  installPlugin(name) {
    cy.exec(`node_modules/.bin/wp-cypress wp "plugin install ${name}"`);
  },

  activatePlugin(name) {
    cy.exec(`node_modules/.bin/wp-cypress wp "plugin activate ${name}"`);
  },

  deactivatePlugin(name) {
    cy.exec(`node_modules/.bin/wp-cypress wp "plugin deactivate ${name}"`);
  },

  visitAdmin(options = {}) {
    cy.visit('/');
    cy.visit('/wp-admin/index.php', options);
  },

  editPost(id, options = {}) {
    cy.visit('/');
    cy.visit(`/wp-admin/post.php?post=${id}&action=edit`, options);
  },

  saveCurrentPost() {
    cy.window().then((win) => win.wp.data.dispatch('core/editor').savePost());
  },

  switchUser(user = 'admin', password = 'password') {
    cy.visit('/wp-login.php');
    cy.get('#user_login').clear().type(user);
    cy.get('#user_pass').clear().type(password);
    cy.get('#wp-submit').click();
  },
};

Object.keys(commands).forEach((command) => {
  Cypress.Commands.add(command, commands[command]);
});
