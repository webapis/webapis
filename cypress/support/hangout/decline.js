Cypress.Commands.add("decline", () => {
  cy.get("[data-testid=message-count]").contains(1);
  cy.get("[data-testid=unread-link]").click();
  cy.get("[data-testid=demouser]").click();
  cy.get("[data-testid=decline-btn]").click();
  cy.get("[data-testid=declined-ui]");
});
