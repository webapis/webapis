Cypress.Commands.add("successfulSignUp", ({ PORT }) => {
  cy.visit(`https://localhost:${PORT}`);
  cy.get("[data-testid=signup-link]").click();
  cy.server();
  cy.route({
    url: "/mock/auth/signup",
    method: "POST",
    status: 200,
    response: { token: "mytoken" },
  });
  cy.get("[data-testid=username]")
    .type("testuser")
    .get("[data-testid=email]")
    .type("testuser@gmail.com")
    .get("[data-testid=password]")
    .type("TestPassword!22s")
    .blur();
  cy.get("[data-testid=signup-btn]").click();
  cy.get("[data-testid=message-username]").should("not.to.be.visible");
  cy.get("[data-testid=message-email]").should("not.to.be.visible");
  cy.get("[data-testid=message-password]").should("not.to.be.visible");
  cy.get("[data-testid=profile-link]");
  // cy.wait("@successSignUp").its("requestBody").should("deep.equal", {
  //   password: "TestPassword!22s",
  //   email: "testuser@gmail.com",
  //   username: "testuser",
  //   browserId: "1234567890",
  // });

  // assert.isNotNull(
  //   cy.window().its("localStorage").invoke("getItem", "browserId"),
  //   "is not null"
  // );
});
