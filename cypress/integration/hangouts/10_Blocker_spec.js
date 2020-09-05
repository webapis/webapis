describe("Blocker", () => {
  beforeEach(() => {
    if (Cypress.env("back") === "node") {
      cy.task("seed:deleteCollection", {
        dbName: "auth",
        collectionName: "users",
      });
    }
    if (Cypress.env("back") === "parse") {
      cy.task("seed:dropDatabase", {
        dbName: "test",
      });
    }
    cy.window()
      .its("localStorage")
      .invoke("setItem", "browserId", JSON.stringify("1234567890"));
  });
  it("blocker recieved succefully", () => {
    cy.signup({ username: "demouser" });
    cy.signout();

    cy.signup({ username: "berouser" });
    cy.signout();
    cy.login({ username: "demouser" });
    cy.invite();

    cy.signout();

    cy.login({ username: "berouser" });

    cy.accept();

    cy.signout();

    cy.login({ username: "demouser" });
    cy.get("[data-testid=unread-link]").should("be.visible");

    cy.get("[data-testid=unread-link]").click();
    cy.get("[data-testid=unread-ui]");
    cy.get("[data-testid=berouser]").click();
    cy.get("[data-testid=hangchat-ui]");
    cy.get("[data-testid=message-input]").type("Hello berouser x");

    cy.get("[data-testid=send-btn]").click();

    cy.signout();

    cy.login({ username: "berouser" });

    cy.block();

    cy.signout();

    cy.login({ username: "demouser" });

    // cy.get("[data-testid=hangouts-link]").click();
    cy.get("[data-testid=berouser]").click();

    cy.get("[data-testid=message-input]").type("Hey x");

    cy.get("[data-testid=send-btn]").click();
    cy.get("[data-testid=blocked-message]").should("be.visible");
  });
});
