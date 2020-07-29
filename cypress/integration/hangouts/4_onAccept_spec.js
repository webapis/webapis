describe("onAccept", () => {
  beforeEach(() => {
    if (Cypress.env("back") === "node") {
      const demo = {
        username: "demo",
        email: "demo@gmail.com",
        password: "Dragonfly1977!!!",
      };
      const bero = {
        username: "bero",
        email: "bero@gmail.com",
        password: "Dragonly_1999!",
      };
      cy.task("seed:deleteCollection", {
        dbName: "auth",
        collectionName: "users",
      });
      cy.task("seed:user", demo);
      cy.task("seed:user", bero);
    }
    if (Cypress.env("back") === "parse") {
      cy.task("seed:dropDatabase", {
        dbName: "test",
      });
    }
  });
  it("invitation accepted successfully", () => {
    const currentDate = Date.UTC(2018, 10, 30);
    cy.clock(currentDate, ["Date"]);
    const hangout = {
      username: "bero",
      timestamp: currentDate,
      message: { text: "Let's chat bero", timestamp: currentDate },
      email: "bero@gmail.com",
      command: "INVITE",
    };

    cy.task("seed:onHangout", {
      hangout,
      senderUsername: "demo",
      senderEmail: "demo@gmail.com",
      dbName: "auth",
      collectionName: "users",
    });
    const expectedHangoutState = {
      username: "demo",
      email: "demo@gmail.com",
      state: "ACCEPT",
      timestamp: currentDate,
      message: { text: "Accepted your invitation", timestamp: currentDate },
    };

    const expectedMessageState = {
      username: "bero",
      state: "pending",
      timestamp: currentDate,
      text: "Accepted your invitation",
    };
    if (Cypress.env("back") === "node") {
      cy.loginByEmail({
        email: "bero@gmail.com",
        password: "Dragonly_1999!",
      });
    }

    cy.visit("/");
    cy.get("[data-testid=message-count]").contains(1);

    cy.get("[data-testid=unread-link]").click();
    cy.get("[data-testid=demo]").click();

    cy.get("[data-testid=accept-btn]")
      .click()
      .then(() => {
        cy.get("[data-testid=spinner]");
        cy.window()
          .its("localStorage")
          .invoke("getItem", "bero-hangouts")
          .then((result) => {
            const unreads = JSON.parse(result);
            const pending = unreads[0];

            expect(pending).to.deep.equal(expectedHangoutState);
          });

        cy.window()
          .its("localStorage")
          .invoke("getItem", "bero-demo-messages")
          .then((result) => {
            const messages = JSON.parse(result);
            const pending = messages[1];

            expect(pending).to.deep.equal(expectedMessageState);
          });
      });

    cy.get("[data-testid=message-count]")
      .contains(0)
      .then(() => {
        cy.window()
          .its("localStorage")
          .invoke("getItem", "bero-hangouts")
          .then((result) => {
            const unreads = JSON.parse(result);
            const pending = unreads[0];

            expect(pending).to.deep.equal({
              ...expectedHangoutState,
              state: "ACCEPTED",
            });
          });

        cy.window()
          .its("localStorage")
          .invoke("getItem", "bero-demo-messages")
          .then((result) => {
            const messages = JSON.parse(result);
            const pending = messages[1];

            expect(pending).to.deep.equal({
              ...expectedMessageState,
              state: "delivered",
            });
          });
        cy.window()
          .its("localStorage")
          .invoke("getItem", "bero-unread-hangouts")
          .then((result) => {
            const messages = JSON.parse(result);

            expect(messages.length).to.equal(0);
          });
        cy.get("[data-testid=hangchat-ui]");
      });
  });
});
