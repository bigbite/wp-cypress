const commands = {
  wp(command) {
    cy.exec(`node_modules/.bin/wp-cypress wp ${command}`);
  },

  seedDB(seed) {
    cy.exec(`node_modules/.bin/wp-cypress wp seed ${seed}`);
  },

  resetDB() {
    cy.exec(`node_modules/.bin/wp-cypress resetDB`);
  },

  visitAdmin() {
    cy.visit('/wp-admin/index.php');
  },

  editPost(id) {
    cy.visit(`/wp-admin/post.php?post=${id}&action=edit`);
  },

  saveCurrentPost() {
    cy.get('body').then((body) => {
      if (!body.find('.editor-post-saved-state').length > 0) {
        cy.get('.editor-post-save-draft').click();
      }
    });
  }
};

for (const command in commands) {
  Cypress.Commands.add(command, commands[command]);
}
