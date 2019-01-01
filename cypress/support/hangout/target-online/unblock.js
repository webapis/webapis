Cypress.Commands.add("unblock", ({ PORT }) => {
  if (PORT === 3006) {
    let demoHangout = {
      target: "berouser",
      email: "berouser@gmail.com",
      state: "BLOCKER",
      timestampe: 1543536000000,
      message: { text: "", timestamp: 1543536000000 },
      browserId: "BID1234567890",
    };
    let beroHangout = {
      target: "demouser",
      email: "demouser@gmail.com",
      state: "BLOCKED",
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
  cy.get("[data-testid=democlient]").find("#connect").click();
  cy.get("[data-testid=beroclient]").find("#connect").click();
  //bero
  cy.get("[data-testid=beroclient]").find("[data-testid=demouser]").click();
  cy.get("[data-testid=beroclient]").find("[data-testid=config-btn]").click();
  cy.get("[data-testid=beroclient]")
    .find("[data-testid=blocked-ui-btn]")
    .click();
  cy.get("[data-testid=beroclient]").find("[data-testid=unblock-btn]").click();
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
              type: "unblocked",
            },
            timestamp,
            state: "UNBLOCKED",
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
              type: "unblocked",
            },
            timestamp,
            state: "UNBLOCKER",
          },
        ],
      };
      expect(browser).to.deep.equal(expected);
    });
  } //IF PORT
  //demo views new message
  cy.get("[data-testid=democlient]").find("[data-testid=unread-link]").click();
  cy.get("[data-testid=democlient]").find("[data-testid=unread-ui]");
  cy.get("[data-testid=democlient]").find("[data-testid=berouser]").click();
});
