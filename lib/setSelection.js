const setBaseAndExtent = (...args) => {
  const document = args[0].ownerDocument;
  document.getSelection().removeAllRanges();
  document.getSelection().setBaseAndExtent(...args);
};

const getTextNode = (el, match) => {
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);

  if (!match) {
    return walk.nextNode();
  }

  let node;

  // eslint-disable-next-line no-cond-assign
  while (node = walk.nextNode()) {
    if (node.wholeText.includes(match)) {
      return node;
    }
  }

  return false;
};

Cypress.Commands.add('setSelection', { prevSubject: true }, (subject, query, endQuery) => cy.wrap(subject)
  .selection(($el) => {
    const anchorNode = getTextNode($el[0], query);
    const focusNode = endQuery ? getTextNode($el[0], endQuery) : anchorNode;
    const anchorOffset = anchorNode.wholeText.indexOf(query);
    const focusOffset = endQuery ? focusNode.wholeText.indexOf(endQuery) + endQuery.length
      : anchorOffset + query.length;
    setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
  }));

Cypress.Commands.add('selection', { prevSubject: true }, (subject, fn) => {
  cy.wrap(subject)
    .trigger('mousedown')
    .then(fn)
    .trigger('mouseup');

  cy.document().trigger('selectionchange');
  return cy.wrap(subject);
});
