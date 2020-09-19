Cypress.Commands.add("undecline", ({ PORT }) => {
  cy.window()
    .its("localStorage")
    .invoke(
      "setItem",
      "berouser-hangouts",
      JSON.stringify([
        {
          target: "demouser",
          email: "demouser@gmail.com",
          state: "DECLINED",
          timestamp: Date.now(),
          message: { text: "", type: "declined", timestamp: Date.now() },
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
          text: "",
          type: "declined",
          timestamp: Date.now(),
          owner: "berouser",
          state: "delivered",
        },
      ])
    );
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
          timestamp: Date.now(),
          message: { text: "", type: "invited", timestamp: Date.now() },
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
          text: "Hello bero ltes chat",
          type: "invited",
          timestamp: Date.now(),
          owner: "demouser",
          state: "delivered",
        },
      ])
    );
  cy.visit(`https://localhost:${PORT}`);
  cy.get("[data-testid=democlient]").find("[data-testid=berouser]").click();
  cy.get("[data-testid=beroclient]").find("[data-testid=demouser]").click();
  cy.get("[data-testid=beroclient]").find("[data-testid=config-btn]").click();
  cy.get("[data-testid=beroclient]")
    .find("[data-testid=declined-ui-btn]")
    .click();
  cy.get("[data-testid=beroclient]")
    .find("[data-testid=undecline-btn]")
    .click();
});
