Cypress.Commands.add("block", () => {
  cy.window()
    .its("localStorage")
    .invoke(
      "setItem",
      "berouser-hangouts",
      JSON.stringify([
        {
          target: "demouser",
          email: "demouser@gmail.com",
          state: "MESSANGER",
          timestamp: Date.now(),
          message: {
            text: "Hello Bero How are you",
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
          owner: "demouser",
          email: "demouser@gmail.com",
          state: "read",
          timestamp: Date.now(),
          text: "Hello Bero How are you",
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
          state: "MESSANGER",
          timestamp: Date.now(),
          message: {
            text: "Hello Demo How are you",
            timestamp: Date.now(),
          },
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
          email: "demouser@gmail.com",
          state: "delivered",
          timestamp: Date.now(),
          text: "Hello Bero How are you",
        },
      ])
    );
  cy.visit("https://localhost:3005");

  cy.get("[data-testid=beroclient]").find("[data-testid=demouser]").click();

  cy.get("[data-testid=democlient]").find("[data-testid=berouser]").click();

  // berouser blocks demouser
  // test config-btn

  cy.get("[data-testid=beroclient]").find("[data-testid=config-btn]").click();
  //test config-close-btn
  cy.get("[data-testid=beroclient]")
    .find("[data-testid=config-close-btn]")
    .click();

  //test block-btn
  cy.get("[data-testid=beroclient]").find("[data-testid=config-btn]").click();
  cy.get("[data-testid=beroclient]").find("[data-testid=bckui-btn]").click();
  cy.get("[data-testid=beroclient]").find("[data-testid=block-btn]").click();

  //demouser will try to send a message to blocked user
  cy.get("[data-testid=democlient]")
    .find("[data-testid=message-input]")
    .type("Hi bero hope you have not blovked me");
  cy.get("[data-testid=democlient]").find("[data-testid=send-btn]").click();
});
