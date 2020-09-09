Cypress.Commands.add("login", ({ username, toggle = false }) => {
  cy.visit("/");
  cy.get("[data-testid=socket-connection]").contains("offline");
  if (toggle) {
    cy.get(".navbar-toggler").click();
  }
  cy.get("[data-testid=login-link]").click();
  if (toggle) {
    cy.get(".navbar-toggler").click();
  }
  cy.get("[data-testid=emailorusername]").type(username);
  cy.get("[data-testid=password]").type("Dragonly_1999!");
  cy.get("[data-testid=login-btn]").click();
  cy.wait(50);
  cy.get("[data-testid=profile-link]").contains(username);
  //  cy.get("[data-testid=socket-connection]").should("have.value","online");
});
