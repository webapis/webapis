describe("onDecline", () => {
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
  it("invitation declined successfully", () => {
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

    if (Cypress.env("back") === "node") {
      cy.loginByEmail({
        email: "bero@gmail.com",
        password: "Dragonly_1999!",
      });
    }

    cy.visit("/");
    cy.get("[data-testid=message-count]").contains(1);
    cy.get("[data-testid=hangouts-link]").click();
    cy.get("[data-testid=unread-link]").click();
    cy.get("[data-testid=demo]")
      .click()
      .then(() => {
        cy.window()
          .its("localStorage")
          .invoke("getItem", "bero-demo-messages")
          .then((result) => {
            const expectedMessageState = {
              username: "demo",
              state: "read",
              timestamp: currentDate,
              text: "Let's chat bero",
            };
            const messages = JSON.parse(result);
            const pending = messages[0];

            expect(pending).to.deep.equal(expectedMessageState);
          });
        cy.window()
          .its("localStorage")
          .invoke("getItem", "bero-unread-hangouts")
          .then((result) => {
            const expectedUnreadState = {
              username: "demo",
              email: "demo@gmail.com",
              state: "INVITER",
              timestamp: currentDate,
              message: { text: "Let's chat bero", timestamp: currentDate },
            };
            const unreads = JSON.parse(result);
            const pending = unreads[0];

            expect(pending).to.deep.equal(expectedUnreadState);
          });

        cy.get("[data-testid=message]").contains("Let's chat bero");
        cy.get("[data-testid=message-sender]").contains("demo");
        cy.get("[data-testid=time]").contains("Now");
      });
    cy.get("[data-testid=decline-btn]")
      .click()
      .then(() => {
        cy.get("[data-testid=spinner]");
      });

    cy.get("[data-testid=blocked-ui]").then(() => {
      cy.window()
        .its("localStorage")
        .invoke("getItem", "bero-unread-hangouts")
        .then((result) => {
          const expectedUnreadState = {
            username: "demo",
            email: "demo@gmail.com",
            state: "DECLINED",
            timestamp: currentDate,
            message: {
              text: "Your invitation declined",
              timestamp: currentDate,
            },
          };
          const unreads = JSON.parse(result);
          const pending = unreads[0];

          expect(pending).to.deep.equal(expectedUnreadState);
        });
    });
    // cy.get("[data-testid=blocked-username]").contains("demo");
  });
});
