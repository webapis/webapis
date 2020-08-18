Cypress.Commands.add("invite", () => {
  cy.get("[data-testid=hangouts-link]").click();
  cy.get("[data-testid=search]").click();

  cy.get("[data-testid=search-ui]");
  cy.get("[data-testid=search-input]").type("berouser");

  cy.get("[data-testid=search-btn]").click();

  cy.get("[data-testid=berouser]").click();
  cy.get("[data-testid=invite-ui]");
  cy.get("[data-testid=messageTextInput]").should(
    "have.value",
    "Let's chat, berouser!"
  );

  cy.get("[data-testid=oninvite-btn]").click();
});
