describe("Testing online state change when authenticated and signout and reauthentication", () => {
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
  it("user signed up ", () => {
    cy.signup({ username: "demouser" });
    cy.get(".badge-success");
    cy.signout();
    cy.get(".badge-danger");
    cy.login({ username: "demouser" });
    cy.get(".badge-success");
    cy.signout();
    cy.get(".badge-danger");
  });
});
