Cypress.Commands.add("invite", () => {
  ///cy.get("[data-testid=hangouts-link]").click();
  cy.get("[data-testid=user-search-input]").click();

  //  cy.get("[data-testid=search-ui]");
  cy.get("[data-testid=user-search-input]").type("berouser");

  cy.get("[data-testid=user-search-button]").click();

  cy.get("[data-testid=berouser]").click();
  cy.get("[data-testid=invite-ui]");
  cy.get("[data-testid=messageTextInput]").should(
    "have.value",
    "Let's chat, berouser!"
  );

  cy.get("[data-testid=oninvite-btn]").click();
  cy.get("[data-testid=invitee-ui]");

  cy.get(".invited");
});
