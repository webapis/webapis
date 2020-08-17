Cypress.Commands.add("login", ({ username }) => {
  cy.visit("/");
  cy.get("[data-testid=login-link]").click();
  cy.get("[data-testid=emailorusername]").type(username);
  cy.get("[data-testid=password]").type("Dragonly_1999!");
  cy.get("[data-testid=login-btn]").click();
});
