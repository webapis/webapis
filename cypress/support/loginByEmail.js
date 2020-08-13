Cypress.Commands.add("loginByEmail", ({ email, password }) => {
  cy.log("email and password", email, password);
  cy.request({
    url: "https://localhost:3000/auth/login",
    method: "GET",
    headers: {
      "Conten-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      Authorization: `Basic ${btoa(`${email}:${password}`)}`,
    },
    failOnStatusCode: false,
  })
    .its("body")
    .then((body) => {
      const { email, username, token } = body;
      cy.window()
        .its("localStorage")
        .invoke(
          "setItem",
          "webcom",
          JSON.stringify({ username, email, token })
        );
    });
});
