import infoMessages from "../../../../client/features/hangouts/ui-components/infoMessages";
Cypress.Commands.add("senderOfflineInvitation", ({ PORT }) => {
  cy.visit(`https://localhost:${PORT}`);

  cy.server();
  cy.route({
    url: "/authed-msg/hangouts/findOne?search=berouser&username=demouser",
    response: {
      hangout: {
        target: "berouser",
        state: "INVITEE",
        email: "berouser@gmail.com",
      },
    },
  });
  cy.route({ url: "/hangout-protocol", method: "post" }).as("protocolCatcher");
  //demo user sends an invitation
  cy.get("[data-testid=democlient]").find("[data-testid=hangouts-btn]").click();
  cy.get("[data-testid=democlient]")
    .find("[data-testid=user-search-input]")
    .type("berouser");
  cy.get("[data-testid=democlient]")
    .find("[data-testid=user-search-button]")
    .click();

  cy.get("[data-testid=democlient]").find("[data-testid=berouser]").click();

  cy.get("[data-testid=democlient]").find("[data-testid=oninvite-btn]").click();

  cy.get("[data-testid=democlient]").find("#connect").click();
  cy.get("[data-testid=beroclient]").find("#connect").click();

  if (PORT === 3006) {
    //test data persistence to sender
    cy.task("query:mongodb", {
      username: "demouser",
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
            target: "berouser",
            email: "berouser@gmail.com",
            message: {
              text: "Let's chat, berouser!",
              timestamp,
              type: "invited",
            },
            timestamp,
            state: "INVITED",
            browserId: "BID1234567890",
          },
        ],
      };
      expect(browser).to.deep.equal(expected);
    });

    //test data persistence to target
    cy.task("query:mongodb", { username: "berouser" }).then((result) => {
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
              text: "Let's chat, berouser!",
              timestamp,
              type: "invited",
            },
            timestamp,
            state: "INVITER",
          },
        ],
      };
      expect(browser).to.deep.equal(expected);
    });
  } //IF PORT//
  cy.get("[data-testid=democlient]")
    .find("[data-testid=info-message]")
    .contains(infoMessages.invited);
  cy.get("[data-testid=democlient]")
    .find("[data-testid=message-input]")
    .should("be.disabled");
  cy.get("[data-testid=democlient]")
    .find("[data-testid=send-btn]")
    .should("be.disabled");
  // cy.pause();
  //berouser accepts a message
  cy.get("[data-testid=beroclient]")
    .find("[data-testid=message-count]")
    .contains(1);
  cy.get("[data-testid=beroclient]").find("[data-testid=unread-link]").click();
  cy.get("[data-testid=beroclient]").find("[data-testid=unread-ui]");
  cy.get("[data-testid=beroclient]").find("[data-testid=demouser]").click();
  cy.get("[data-testid=beroclient]")
    .find("[data-testid=message-count]")
    .contains(0);

  cy.get("[data-testid=beroclient]").find("[data-testid=accept-btn]").click();
  //test accepted persistence
  if (PORT === 3006) {
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
              text: "Accepted your invitation",
              timestamp,
            },
            timestamp,
            state: "ACCEPTED",
            browserId: "BID1234567890",
          },
        ],
      };
      expect(browser).to.deep.equal(expected);
    });

    cy.task("query:mongodb", {
      username: "demouser",
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
            target: "berouser",
            email: "berouser@gmail.com",
            message: {
              text: "Accepted your invitation",
              timestamp,
            },
            timestamp,
            state: "ACCEPTER",
          },
        ],
      };
      expect(browser).to.deep.equal(expected);
    });
  } //IF PORT
  //demouser send a message
  cy.get("[data-testid=democlient]")
    .find("[data-testid=message-input]")
    .should("be.enabled");
  cy.get("[data-testid=democlient]")
    .find("[data-testid=send-btn]")
    .should("be.enabled");

  cy.get("[data-testid=democlient]")
    .find("[data-testid=message-input]")
    .type("Hello Bero how are you");
  cy.get("[data-testid=democlient]").find("[data-testid=send-btn]").click();
  if (PORT === 3006) {
    //test data persistence to sender
    cy.task("query:mongodb", {
      username: "demouser",
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
            target: "berouser",
            email: "berouser@gmail.com",
            message: {
              text: "Hello Bero how are you",
              timestamp,
              //type: "invited",
            },
            timestamp,
            state: "MESSAGED",
            browserId: "BID1234567890",
          },
        ],
      };
      expect(browser).to.deep.equal(expected);
    });

    //test data persistence to target
    cy.task("query:mongodb", { username: "berouser" }).then((result) => {
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
              text: "Hello Bero how are you",
              timestamp,
              //  type: "invited",
            },
            timestamp,
            state: "MESSANGER",
          },
        ],
      };
      expect(browser).to.deep.equal(expected);
    });
  } //IF PORT
  //berouser send a messages
  cy.get("[data-testid=beroclient]")
    .find("[data-testid=message-input]")
    .type("I am fine how are you demo.");
  cy.get("[data-testid=beroclient]").find("[data-testid=send-btn]").click();
});
