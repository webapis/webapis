describe("Decliner", () => {
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
  it("Decliner succeful", () => {
    const inviter = {
      username: "bero",
      timestamp: Date.now(),
      message: { text: "Lets chat bero", timestamp: Date.now() },
      email: "bero@gmail.com",
      command: "INVITE",
    };

    cy.task("seed:onHangout", {
      hangout: inviter,
      senderUsername: "demo",
      dbName: "auth",
      collectionName: "users",
    });

    const decliner = {
      username: "demo",
      timestamp: Date.now(),
      message: { text: "Your invitation is declined", timestamp: Date.now() },
      email: "demo@gmail.com",
      command: "DECLINE",
    };

    cy.task("seed:onHangout", {
      hangout: decliner,
      senderUsername: "bero",
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
    //   cy.get("[data-testid=unread-link]").click();

    //     cy.get("[data-testid=bero]").click();
  });
});
