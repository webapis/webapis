Cypress.Commands.add("message", () => {
  cy.get("[data-testid=unread-link]").click();
  cy.get("[data-testid=berouser]").click();
  cy.get("[data-testid=message-input]").type("Hello berouser");
  cy.get("[data-testid=send-btn]").click();
});
