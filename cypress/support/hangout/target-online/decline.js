Cypress.Commands.add("decline", ({ PORT }) => {
  if (PORT === 3006) {
    let demoHangout = {
      target: "berouser",
      email: "berouser@gmail.com",
      state: "INVITED",
      timestamp: 1543536000000,
      message: { text: "Let's chat bero", timestamp: 1543536000000 },
      browserId: "BID1234567890",
    };
    let beroHangout = {
      target: "demouser",
      email: "demouser@gmail.com",
      state: "INVITER",
      timestamp: 1543536000000,
      message: { text: "Let's chat bero", timestamp: 1543536000000 },
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
  cy.get("[data-testid=democlient]").find("#connect").click();
  cy.get("[data-testid=beroclient]").find("#connect").click();
  cy.get("[data-testid=beroclient]").find("[data-testid=demouser]").click();
  cy.get("[data-testid=beroclient]").find("[data-testid=decline-btn]").click();
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
              type: "declined",
            },
            timestamp,
            state: "DECLINED",
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
              type: "declined",
            },
            timestamp,
            state: "DECLINER",
          },
        ],
      };
      expect(browser).to.deep.equal(expected);
    });
  } //IF PORT
});
