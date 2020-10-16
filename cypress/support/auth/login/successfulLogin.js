Cypress.Commands.add("successfulLogin", ({ PORT }) => {
  cy.task("seed:user", {
    email: "testuser@gmail.com",
    username: "testuser",
    password: "TestPassword!22s",
  });
  cy.visit(`https://localhost:${PORT}`);
  // cy.get("[data-testid=login-link]").click();
  cy.route({
    url: "/mock/auth/login",
    status: 400,
    response: {
      token: "mytoken",
      email: "testuser@gmail.com",
      username: "testuser",
    },
    method: "POST",
  });

  cy.get("[data-testid=emailorusername]").type("testuser");
  cy.get("[data-testid=password]").type("TestPassword!22s");
  cy.get("[data-testid=signin-btn]").click();
});
