Cypress.Commands.add("signout", () => {
  cy.get("[data-testid=signout-link]").click();
});
