Cypress.Commands.add("undecline", ({ PORT }) => {
  if (PORT === 3006) {
    let demoHangout = {
      target: "berouser",
      email: "berouser@gmail.com",
      state: "DECLINER",
      timestampe: 1543536000000,
      message: { text: "", timestamp: 1543536000000 },
      browserId: "BID1234567890",
    };
    let beroHangout = {
      target: "demouser",
      email: "demouser@gmail.com",
      state: "DECLINED",
      timestampe: 1543536000000,
      message: { text: "", timestamp: 1543536000000 },
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
  cy.get("[data-testid=democlient]").find("#connect").click();
  cy.get("[data-testid=beroclient]").find("#connect").click();
  cy.get("[data-testid=democlient]").find("[data-testid=berouser]").click();
  cy.get("[data-testid=beroclient]").find("[data-testid=demouser]").click();
  cy.get("[data-testid=beroclient]").find("[data-testid=config-btn]").click();
  cy.get("[data-testid=beroclient]")
    .find("[data-testid=declined-ui-btn]")
    .click();
  cy.get("[data-testid=beroclient]")
    .find("[data-testid=undecline-btn]")
    .click();
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
              text: "Invitation accepted",
              timestamp,
              type: "undeclined",
            },
            timestamp,
            state: "UNDECLINED",
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
              text: "Invitation accepted",
              timestamp,
              type: "undeclined",
            },
            timestamp,
            state: "UNDECLINER",
          },
        ],
      };
      expect(browser).to.deep.equal(expected);
    });
  } //IF PORT
  cy.get("[data-testid=democlient]")
    .find("[data-testid=message-input]")
    .should("be.enabled");
  cy.get("[data-testid=democlient]")
    .find("[data-testid=send-btn]")
    .should("be.enabled");
});
