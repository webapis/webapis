Cypress.Commands.add("accept", () => {
  cy.get("[data-testid=message-count]").contains(1);

  cy.get("[data-testid=unread-link]").click();
  cy.get("[data-testid=demouser]").click();
  cy.get("[data-testid=accept-btn]").click();
});
