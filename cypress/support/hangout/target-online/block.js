Cypress.Commands.add("block", ({ PORT }) => {
  if (PORT === 3006) {
    let demoHangout = {
      target: "berouser",
      email: "berouser@gmail.com",
      state: "MESSAGED",
      timestampe: 1543536000000,
      message: { text: "Hello bero", timestamp: 1543536000000 },
      browserId: "BID1234567890",
    };
    let beroHangout = {
      target: "demouser",
      email: "demouser@gmail.com",
      state: "MESSAGER",
      timestampe: 1543536000000,
      message: { text: "Hello bero", timestamp: 1543536000000 },
      browserId: "BID1234567890",
    };
    cy.task("seed:hangout", {
      username: "demouser",
      hangout: demoHangout,
    });

    cy.task("seed:hangout", { username: "berouser", hangout: beroHangout });
  }

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

  cy.visit(`https://localhost:${PORT}`);
  cy.get("[data-testid=democlient]").find("#connect").click();

  cy.get("[data-testid=beroclient]").find("#connect").click();
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
  if (PORT === 3006) {
    //test data persistence to sender
    cy.task("query:mongodb", {
      username: "berouser",
    }).then((result) => {
      const { browsers } = result;

      expect(browsers.length).to.equal(1);

      const browser = browsers[0];
      const { hangouts } = browser;
      const { timestamp } = hangouts[0];

      let expected = {
        browserId: "BID1234567890",
        hangouts: [
          {
            target: "demouser",
            email: "demouser@gmail.com",
            message: {
              text: "",
              timestamp,
              type: "blocked",
            },
            timestamp,
            state: "BLOCKED",
            browserId: "BID1234567890",
          },
        ],
      };
      expect(browser).to.deep.equal(expected);
    });

    //test data persistence to target
    cy.task("query:mongodb", { username: "demouser" }).then((result) => {
      const { browsers } = result;

      expect(browsers.length).to.equal(1);

      const browser = browsers[0];
      const { hangouts } = browser;
      const { timestamp } = hangouts[0];
      let expected = {
        browserId: "BID1234567890",
        hangouts: [
          {
            target: "berouser",
            email: "berouser@gmail.com",
            message: {
              text: "",
              timestamp,
              type: "blocked",
            },
            timestamp,
            state: "BLOCKER",
          },
        ],
      };
      expect(browser).to.deep.equal(expected);
    });
  } //IF PORT
  //demouser will try to send a message to blocked user

  cy.get("[data-testid=democlient]")
    .find("[data-testid=message-input]")
    .type("Hi bero hope you have not blovked me");
  cy.get("[data-testid=democlient]").find("[data-testid=send-btn]").click();
});
