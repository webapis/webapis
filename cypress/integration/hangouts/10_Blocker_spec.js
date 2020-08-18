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
  });
  it("blocker recieved succefully", () => {
    const currentDate = Date.UTC(2018, 10, 30);
    cy.clock(currentDate, ["Date"]);
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
    cy.get("[data-testid=unread-link]").click();
    cy.get("[data-testid=berouser]").click();
    cy.get("[data-testid=message-input]").type("Hello berouser x");
    cy.get("[data-testid=send-btn]").click();
    cy.signout();
    cy.login({ username: "berouser" });
    cy.block();
    cy.signout();
    cy.login({ username: "demouser" });

    cy.get("[data-testid=hangouts-link]").click();
    cy.get("[data-testid=berouser]").click();
    cy.get("[data-testid=message-input]").type("Hey x");
    cy.get("[data-testid=send-btn]").click();
    cy.get("[data-testid=blocker-message]").should("be.visible");
  });
});
