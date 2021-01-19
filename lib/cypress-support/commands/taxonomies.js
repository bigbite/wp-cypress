module.exports = {
  /**
   * Visits the taxonomy create and list page.
   * @param {string} slug The slug name of the taxonomy.
   * @param {string|bool} postType The post type of the taxonomy if required.
   * @param {object} options Options to pass to cy.visit()
   */
  visitTaxonomy(slug, postType = false, options = {}) {
    const postTypeString = postType ? "" : `&post_type=${postType}`;
    cy.visit(
      `/wp-admin/edit-tags.php?taxonomy=${slug}${postTypeString}`,
      options
    );
  },

  /**
   * Clicks the save taxonomy button on the creation page.
   * @param {object} options Options to pass to cy.click()
   */
  saveNewTerm(options = { force: true }) {
    cy.get('.submit #submit[type="submit"]').click({ force: true });
  },

  /**
   * Clicks the update taxonomy button on the edit page.
   * @param {object} options Options to pass to cy.click()
   */
  saveCurrentTerm(options = { force: true }) {
    cy.get('.edit-tag-actions input[type="submit"]').click(options);
  },

  /**
   * Get the title element of the term from a specified column on a taxonomy list.
   * @param {string} num The column number of the taxonomy term.
   */
  getTermTitle(num) {
    return cy.get(`#the-list > tr:nth-child(${num}) .column-name .row-title`);
  },

  /**
   * Click the term edit link in the taxonomy list.
   * @param {string} num The column number of the taxonomy term.
   * @param {object} options Options to pass to cy.click()
   */
  clickTermEdit(num, options = { force: true }) {
    cy.get(
      `#the-list > tr:nth-child(${num}) .column-name .row-actions .edit a`
    ).click(options);
  },
};
