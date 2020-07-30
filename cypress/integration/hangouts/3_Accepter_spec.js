describe("Accepter", () => {
  beforeEach(() => {
    if (Cypress.env("back") === "node") {
      const demo = {
        username: "demo",
        email: "demo@gmail.com",
        password: "Dragonly_1999!",
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
  it("Accepter succeful", () => {
    const timestamp = Date.UTC(2018, 10, 30);
    cy.clock(timestamp, ["Date"]);
    const inviter = {
      username: "bero",
      timestamp,
      message: { text: "Let's cha bero", timestamp },
      email: "bero@gmail.com",
      command: "INVITE",
    };

    cy.task("seed:onHangout", {
      hangout: inviter,
      senderUsername: "demo",
      senderEmail: "demo@gmail.com",
      dbName: "auth",
      collectionName: "users",
    });

    const accepter = {
      username: "demo",
      timestamp,
      message: { text: "Your invitation is accepted", timestamp },
      email: "demo@gmail.com",
      command: "ACCEPT",
    };

    cy.task("seed:onHangout", {
      hangout: accepter,
      senderUsername: "bero",
      senderEmail: "bero@gmail.com",
      dbName: "auth",
      collectionName: "users",
    });

    if (Cypress.env("back") === "node") {
      cy.loginByEmail({
        email: "demo@gmail.com",
        password: "Dragonly_1999!",
      });
    }

    cy.visit("/");
    cy.get("[data-testid=message-count]")
      .contains(1)
      .then(() => {
        cy.get("[data-testid=unread-link]")
          .click()
          .then(() => {
            cy.get("[data-testid=bero]").contains(
              "bero,Your invitation is accepted"
            );
            cy.get("[data-testid=bero]").click();
            cy.get("[data-testid=message]").contains(
              "Your invitation is accepted"
            );
            cy.get("[data-testid=message-sender]").contains("bero");
            cy.get("[data-testid=time]").contains("Now");
          });
      });
  });
});
