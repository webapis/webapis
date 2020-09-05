Cypress.Commands.add("signout", () => {
  cy.get("[data-testid=signout-link]").click();
  cy.get("[data-testid=login-link]");
  cy.wait(50);
  cy.get("[data-testid=socket-connection]").contains("offline");
  debugger;
});
