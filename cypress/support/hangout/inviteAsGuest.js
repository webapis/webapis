Cypress.Commands.add("inviteasguest", () => {
  cy.server();
  cy.route({
    url: "/authed-msg/hangouts/findOne?search=berouser&username=demouser",
    status: 400,
    response: { hangout: null },
  });
  cy.route({
    url: "/googleapis/gmailapi",
    status: 200,
    response: {},
    method: "POST",
  });
  cy.visit("https://localhost:3005");
  cy.get("[data-testid=democlient]")
    .find("[data-testid=user-search-input]")
    .type("berouser");
  cy.get("[data-testid=democlient]")
    .find("[data-testid=user-search-button]")
    .click();
  cy.get("[data-testid=democlient]")
    .find("[data-testid=invite-as-guest-btn]")
    .click();
  //guest-email-input
  cy.get("[data-testid=democlient]")
    .find("[data-testid=guest-email-input]")
    .type("webapis.github@gmail.com");
  cy.get("[data-testid=democlient]").find("[data-testid=invite-btn]").click();
});
