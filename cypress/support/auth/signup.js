Cypress.Commands.add("signup", ({ username }) => {
  cy.visit("/");
  cy.get("[data-testid=signup-link]").click();
  cy.get("[data-testid=username]").type(username);
  cy.get("[data-testid=email]").type(`${username}@gmail.com`);
  cy.get("[data-testid=password]").type("Dragonly_1999!");
  cy.get("[data-testid=signup-btn]").click();
});
