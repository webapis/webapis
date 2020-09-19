Cypress.Commands.add("decline", ({ PORT }) => {
  cy.window()
    .its("localStorage")
    .invoke(
      "setItem",
      "demouser-hangouts",
      JSON.stringify([
        {
          target: "berouser",
          email: "berouser@gmail.com",
          state: "INVITED",
          message: {
            text: "Lets chat bero",
            timestamp: Date.now(),
          },
          timestamp: Date.now(),
        },
      ])
    );

  cy.window()
    .its("localStorage")
    .invoke(
      "setItem",
      "demouser-berouser-messages",
      JSON.stringify([
        {
          owner: "demouser",
          text: "Lets chat bero",
          timestamp: Date.now(),
          state: "delivered",
        },
      ])
    );

  cy.window()
    .its("localStorage")
    .invoke(
      "setItem",
      "berouser-hangouts",
      JSON.stringify([
        {
          target: "demouser",
          email: "demouser@gmail.com",
          state: "INVITER",
          message: {
            text: "Lets chat bero",
            timestamp: Date.now(),
          },
          timestamp: Date.now(),
        },
      ])
    );

  cy.window()
    .its("localStorage")
    .invoke(
      "setItem",
      "berouser-demouser-messages",
      JSON.stringify([
        {
          owner: "demouser",
          text: "Lets chat bero",
          timestamp: Date.now(),
          state: "delivered",
        },
      ])
    );
  cy.visit(`https://localhost:${PORT}`);

  cy.get("[data-testid=beroclient]").find("[data-testid=demouser]").click();
  cy.get("[data-testid=beroclient]").find("[data-testid=decline-btn]").click();
});
