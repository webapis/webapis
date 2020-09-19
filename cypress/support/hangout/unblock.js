Cypress.Commands.add("unblock", ({ PORT }) => {
  cy.window()
    .its("localStorage")
    .invoke(
      "setItem",
      "berouser-hangouts",
      JSON.stringify([
        {
          target: "demouser",
          email: "demouser@gmail.com",
          state: "BLOCKED",
          timestamp: Date.now(),
          message: {
            text: "",
            timestamp: Date.now(),
          },
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
          state: "BLOCKED",
          timestamp: Date.now(),
          message: {
            text: "",
            timestamp: Date.now(),
          },
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
          datetime: Date.now(),
          owner: "berouser",
          type: "blocked",
          state: "delivered",
        },
      ])
    );
  cy.visit(`https://localhost:${PORT}`);
  //bero
  cy.get("[data-testid=beroclient]").find("[data-testid=demouser]").click();
  cy.get("[data-testid=beroclient]").find("[data-testid=config-btn]").click();
  cy.get("[data-testid=beroclient]")
    .find("[data-testid=blocked-ui-btn]")
    .click();
  cy.get("[data-testid=beroclient]").find("[data-testid=unblock-btn]").click();

  //demo views new message
  cy.get("[data-testid=democlient]").find("[data-testid=unread-link]").click();
  cy.get("[data-testid=democlient]").find("[data-testid=unread-ui]");
  cy.get("[data-testid=democlient]").find("[data-testid=berouser]").click();
});
