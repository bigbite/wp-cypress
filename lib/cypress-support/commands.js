require('./hooks');
require('./setSelection');

const wpCypress =
  Cypress.platform === 'win32' ? 'node_modules\\.bin\\wp-cypress' : 'node_modules/.bin/wp-cypress';

const commands = {
  wp(command) {
    cy.exec(`${wpCypress} wp "${command}"`);
  },

  seed(seeder) {
    cy.exec(`${wpCypress} wp "seed ${seeder}"`).then((result) => {
      cy.log(result.stdout);
    });
  },

  seedClean(seeder) {
    cy.exec(`${wpCypress} wp "seed ${seeder} --clean"`).then((result) => {
      cy.log(result.stdout);
    });
  },

  cleanThenSeed(seeder) {
    cy.exec(`${wpCypress} wp "seed ${seeder} --clean-first"`).then((result) => {
      cy.log(result.stdout);
    });
  },

  resetWP(version = false) {
    const wpVersion = version || (Cypress.wp || {}).version || false;
    cy.log('WP Cypress: performing full teardown...');
    cy.exec(`${wpCypress} soft-reset ${wpVersion ? `--version="${wpVersion}"` : ''}`);
  },

  installTheme(name) {
    cy.exec(`${wpCypress} wp "theme install ${name}"`);
  },

  activateTheme(name) {
    cy.exec(`${wpCypress} wp "theme activate ${name}"`);
  },

  installPlugin(name) {
    cy.exec(`${wpCypress} wp "plugin install ${name}"`);
  },

  activatePlugin(name) {
    cy.exec(`${wpCypress} wp "plugin activate ${name}"`);
  },

  deactivatePlugin(name) {
    cy.exec(`${wpCypress} wp "plugin deactivate ${name}"`);
  },

  visitAdmin(options = {}) {
    cy.visit('/wp-admin/index.php', options);
  },

  editPost(id, options = {}) {
    cy.visit(`/wp-admin/post.php?post=${id}&action=edit`, options);
  },

  saveCurrentPost() {
    cy.window().then((win) => win.wp.data.dispatch('core/editor').savePost());
  },

  switchUser(user = 'admin', password = null) {
    if (password) {
      cy.exec(`${wpCypress} wp "wp-cypress-set-user --logout"`).then(() => {
        cy.clearCookies();
        cy.visit('/wp-login.php?loggedout=true');

        // Check if Jetpack SSO is installed, click through if so.
        cy.get('body').then((body) => {
          if (body.find('.jetpack-sso-toggle.wpcom').length > 0) {
            cy.get('.jetpack-sso-toggle.wpcom').click();
          }
        });

        cy.get('#user_login').focus().invoke('val', user);
        cy.get('#user_pass').focus().invoke('val', password);
        cy.get('#wp-submit').click();
      });
    } else {
      cy.exec(`${wpCypress} wp "wp-cypress-set-user ${user}"`);
    }
  },

  logout() {
    cy.exec(`${wpCypress} wp "wp-cypress-set-user --logout"`).then(() => {
      cy.clearCookies();
      cy.visit('/wp-login.php?loggedout=true');
    });
  },
};

Object.keys(commands).forEach((command) => {
  Cypress.Commands.add(command, commands[command]);
});
