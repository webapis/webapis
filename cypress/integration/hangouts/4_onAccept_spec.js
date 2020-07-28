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

    const hangout = {
      username: "bero",
      timestamp: Date.now(),
      message: { text: "Lets chant", timestamp: Date.now() },
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
  });
  it("invitation accepted successfully", () => {
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
    cy.get("[data-testid=demo]").click();
    cy.get("[data-testid=accept-btn]").click();
    cy.get("[data-testid=hangchat-ui]");
  });
});
