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
    cy.get("[data-testid=unread-link]").click();
    cy.get("[data-testid=demo]").should("have.length", 1);
    cy.get(".badge-primary").contains(1);
    cy.get("[data-testid=demo]").click();
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid]")
      .contains("Let's chat bero");
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid=message-sender]")
      .contains("demo");
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid=time]")
      .contains("Now");

    cy.get("[data-testid=decline-btn]").click();
    cy.get("[data-testid=declined-ui]");
    cy.get("[data-testid=message-count]").contains(0);
  });
});
