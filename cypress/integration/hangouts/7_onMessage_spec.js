describe("onMessage_spec", () => {
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
  it("message is sent succefully", () => {
    const timestamp = Date.UTC(2018, 10, 30);
    cy.clock(timestamp, ["Date"]);

    //  let timestamp = Date.now();
    const inviter = {
      username: "berouser",
      timestamp,
      message: { text: "Hello berouser let's chat", timestamp },
      email: "berouser@gmail.com",
      command: "INVITE",
    };

    cy.task("seed:onHangout", {
      hangout: inviter,
      senderUsername: "demouser",
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

    // const read = {
    //   username: "berouser",
    //   timestamp,
    //   message: { text: "Your invitation is accepted", timestamp },
    //   email: "berouser@gmail.com",
    //   command: "READ",
    // };
    // cy.task("seed:onHangout", {
    //   hangout: read,
    //   senderUsername: "demouser",
    //   senderEmail: "demouser@gmail.com",
    //   dbName: "auth",
    //   collectionName: "users",
    // });
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

    cy.get("[data-testid=hangouts-link]").click();

    cy.get("[data-testid=berouser]").click();
    cy.get("[data-testid=message-input]").type("Hello berouser");
    cy.get("[data-testid=send-btn]")
      .click()
      .then(() => {
        cy.get("[data-testid=right-message-wrapper]")
          .find("[data-testid=message]")
          .contains("Hello berouser");
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
