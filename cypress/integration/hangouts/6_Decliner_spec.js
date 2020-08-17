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
    cy.login({ username: "demouser" });
    cy.get("[data-testid=message-count]").contains(0);
    cy.get("[data-testid=hangouts-link]").click();
    cy.get("[data-testid=berouser]").click();
  });
});
