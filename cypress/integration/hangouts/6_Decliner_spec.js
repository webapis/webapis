describe("Decliner", () => {
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
    //   cy.visit("/");
  });
  it("Decliner succeful", () => {
    cy.signup({ username: "demouser" });
    cy.signout();
    cy.signup({ username: "berouser" });
    cy.signout();
    cy.login({ username: "demouser" });

    cy.invite();
    cy.signout();
    cy.login({ username: "berouser" });
    cy.decline();
    cy.signout();
    cy.pause();
    cy.login({ username: "demouser" });
    // cy.get("[data-testid=unread-link]");
    // cy.get("[data-testid=unread-link]").find("[data-testid=message-count]")
    // .contains(0);
    //  cy.get("[data-testid=hangouts-link]").click();
    cy.get("[data-testid=berouser]").click();
  });
});
