describe("Decliner", () => {
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
  it("Decliner succeful", () => {
    const inviter = {
      username: "berouser",
      timestamp: Date.now(),
      message: { text: "Lets chat berouser", timestamp: Date.now() },
      email: "berouser@gmail.com",
      command: "INVITE",
    };

    cy.task("seed:onHangout", {
      hangout: inviter,
      senderUsername: "demouser",
      dbName: "auth",
      collectionName: "users",
    });

    const decliner = {
      username: "demouser",
      timestamp: Date.now(),
      message: null,
      email: "demouser@gmail.com",
      command: "DECLINE",
    };

    cy.task("seed:onHangout", {
      hangout: decliner,
      senderUsername: "berouser",
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
    cy.get("[data-testid=message-count]").contains(0);
    cy.get("[data-testid=hangouts-link]").click();
    cy.get("[data-testid=berouser]").click();
  });
});
