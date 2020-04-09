const commands = {
  // General
  wp(command) {
    cy.exec(`node_modules/.bin/wp-cypress wp "${command}"`);
  },

  seedDB(seed) {
    cy.exec(`node_modules/.bin/wp-cypress wp "seed ${seed}"`);
  },

  resetDB() {
    cy.exec('node_modules/.bin/wp-cypress resetDB');
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
    cy.visit('/wp-admin/index.php', options);
  },

  // Posts
  editPost(id, options = {}) {
    cy.visit(`/wp-admin/post.php?post=${id}&action=edit`, options);
  },

  saveCurrentPost() {
    cy.window().then((win) => win.wp.data.dispatch('core/editor').savePost());
  },
};

Object.keys(commands).forEach((command) => {
  Cypress.Commands.add(command, commands[command]);
});
