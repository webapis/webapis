Cypress.Commands.add("signup", ({ username, toggle = false }) => {
  cy.visit("/");
  cy.get("[data-testid=socket-connection]").contains("offline");
  if (toggle) {
    cy.get(".navbar-toggler").click();
  }
  cy.get("[data-testid=signup-link]").click();

  cy.get("[data-testid=username]").type(username);
  cy.get("[data-testid=email]").type(`${username}@gmail.com`);
  cy.get("[data-testid=password]").type("Dragonly_1999!");
  cy.get("[data-testid=signup-btn]").click();
  cy.wait(50);
  cy.get("[data-testid=profile-link]").contains(username);
  // cy.get("[data-testid=socket-connection]").contains("online");
});
