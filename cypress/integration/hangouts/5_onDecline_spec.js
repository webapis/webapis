describe("onDecline", () => {
  beforeEach(() => {
    if (Cypress.env("back") === "node") {
      const demouser = {
        username: "demouser",
        email: "demouser@gmail.com",
        password: "Dragonfly1977!!!",
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
  it("invitation declined successfully", () => {
    const currentDate = Date.UTC(2018, 10, 30);
    cy.clock(currentDate, ["Date"]);
    const hangout = {
      username: "berouser",
      timestamp: currentDate,
      message: { text: "Let's chat berouser", timestamp: currentDate },
      email: "berouser@gmail.com",
      command: "INVITE",
    };

    cy.task("seed:onHangout", {
      hangout,
      senderUsername: "demouser",
      senderEmail: "demouser@gmail.com",
      dbName: "auth",
      collectionName: "users",
    });
    cy.window()
      .its("localStorage")
      .invoke("setItem", "berouser-browserId", "1234567890");
    if (Cypress.env("back") === "node") {
      cy.loginByEmail({
        email: "berouser@gmail.com",
        password: "Dragonly_1999!",
        hasBrowserId: true,
      });
    }

    cy.visit("/");
    cy.get("[data-testid=message-count]").contains(1);
    cy.get("[data-testid=unread-link]").click();
    cy.get("[data-testid=demouser]").should("have.length", 1);
    cy.get(".badge-primary").contains(1);
    cy.get("[data-testid=demouser]").click();
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid]")
      .contains("Let's chat berouser");
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid=message-sender]")
      .contains("demouser");
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid=time]")
      .contains("Now");

    cy.get("[data-testid=decline-btn]").click();
    cy.get("[data-testid=declined-ui]");
    cy.get("[data-testid=message-count]").contains(0);
  });
});
