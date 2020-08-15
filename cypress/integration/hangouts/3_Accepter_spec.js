describe("Accepter", () => {
  beforeEach(() => {
    if (Cypress.env("back") === "node") {
      const demouser = {
        username: "demouser",
        email: "demouser@gmail.com",
        password: "Dragonly_1999!",
      };
      const berouser = {
        username: "berouser",
        email: "berouser@gmail.com",
        password: "Dragonly_1999!",
      };
      cy.task("seed:deleteCollection", {
        dbName: "auth",
        collectionName: "users",
      });
      cy.task("seed:user", demouser);
      cy.task("seed:user", berouser);
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
      username: "berouser",
      timestamp,
      message: { text: "Let's cha berouser", timestamp },
      email: "berouser@gmail.com",
      command: "INVITE",
    };

    cy.task("seed:onHangout", {
      hangout: inviter,
      senderUsername: "demouser",
      senderEmail: "demouser@gmail.com",
      dbName: "auth",
      collectionName: "users",
    });

    const accepter = {
      username: "demouser",
      timestamp,
      message: { text: "Your invitation is accepted", timestamp },
      email: "demouser@gmail.com",
      command: "ACCEPT",
    };

    cy.task("seed:onHangout", {
      hangout: accepter,
      senderUsername: "berouser",
      senderEmail: "berouser@gmail.com",
      dbName: "auth",
      collectionName: "users",
    });
    cy.window()
      .its("localStorage")
      .invoke("setItem", "demouser-browserId", "1234567890");
    if (Cypress.env("back") === "node") {
      cy.loginByEmail({
        email: "demouser@gmail.com",
        password: "Dragonly_1999!",
        hasBrowserId: true,
      });
    }

    cy.visit("/");

    cy.get("[data-testid=message-count]")
      .contains(1)
      .then(() => {
        cy.get("[data-testid=unread-link]")
          .click()
          .then(() => {
            cy.get("[data-testid=berouser]").should("have.length", 1);
            cy.get(".badge-primary").contains(1);
            cy.get("[data-testid=berouser]").click();
            cy.get("[data-testid=message]").contains(
              "Your invitation is accepted"
            );
            cy.get("[data-testid=message-sender]").contains("berouser");
            cy.get("[data-testid=time]").contains("Now");
            cy.get("[data-testid=left-message-wrapper]")
              .find(".message-state")
              .contains("read");
          });
      });
  });
});
