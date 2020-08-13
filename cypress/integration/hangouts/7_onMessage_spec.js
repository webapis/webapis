describe("onMessage_spec", () => {
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
  it("message is sent succefully", () => {
    const timestamp = Date.UTC(2018, 10, 30);
    cy.clock(timestamp, ["Date"]);

    //  let timestamp = Date.now();
    const inviter = {
      username: "bero",
      timestamp,
      message: { text: "Hello bero let's chat", timestamp },
      email: "bero@gmail.com",
      command: "INVITE",
    };

    cy.task("seed:onHangout", {
      hangout: inviter,
      senderUsername: "demo",
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

    const read = {
      username: "bero",
      timestamp,
      message: { text: "Your invitation is accepted", timestamp },
      email: "bero@gmail.com",
      command: "READ",
    };
    cy.task("seed:onHangout", {
      hangout: read,
      senderUsername: "demo",
      senderEmail: "demo@gmail.com",
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

    cy.get("[data-testid=hangouts-link]").click();

    cy.get("[data-testid=bero]").click();
    cy.get("[data-testid=message-input]").type("Hello bero");
    cy.get("[data-testid=send-btn]")
      .click()
      .then(() => {
        cy.get("[data-testid=right-message-wrapper]")
          .find("[data-testid=message]")
          .contains("Hello bero");
        cy.get("[data-testid=right-message-wrapper]")
          .find("[data-testid=message-sender]")
          .contains("me");
        cy.get("[data-testid=right-message-wrapper]")
          .find("[data-testid=time]")
          .contains("Now");
        cy.get("[data-testid=message-input]").should("have.value", "");
      });
  });
});
