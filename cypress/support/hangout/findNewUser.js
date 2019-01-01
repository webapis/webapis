Cypress.Commands.add("findNewUser", ({ username, email, PORT }) => {
  cy.server();
  cy.route({
    url:
      "/authed-msg/hangouts/findOne?search=berouser@gmail.com&username=demouser",
  }).as("searchByEmail");
  cy.route({
    url: "/authed-msg/hangouts/findOne?search=berouser&username=demouser",
  }).as("searchByUsername");

  //test hangout seed
  cy.visit(`https://localhost:${PORT}`);
  cy.get("[data-testid=democlient]").find("[data-testid=hangouts-btn]").click();
  cy.get("[data-testid=democlient]")
    .find("[data-testid=user-search-input]")
    .type(username ? username : email);
  cy.get("[data-testid=democlient]")
    .find("[data-testid=user-search-button]")
    .click();
});
