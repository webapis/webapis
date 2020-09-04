Cypress.Commands.add("block", () => {
  ///cy.get("[data-testid=hangouts-link]").click();

  cy.get("[data-testid=demouser]").click();
  cy.get("[data-testid=hangchat-ui]");
  cy.get("[data-testid=nav-config]").click();
  cy.get("[data-testid=config-ui]");
  cy.get("[data-testid=bckui-btn]").click();
  cy.get("[data-testid=block-ui]");
  cy.get("[data-testid=block-btn]").click();
});
