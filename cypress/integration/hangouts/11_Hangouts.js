describe("Test Hangouts", () => {
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

    cy.visit("/");

    cy.signup({ username: "demouser" });
    cy.signout();
    cy.signup({ username: "berouser" });
    cy.signout();
    cy.login({ username: "demouser" });
  });
  it("Initial Hangouts load", () => {
    cy.get("[data-testid=user-search-button]").should("be.disabled");
    cy.signout();
  });
  it("User enter username", () => {
    cy.get("[data-testid=user-search-input]").type("userthree");
    cy.get("[data-testid=user-search-button]").should("be.enabled");
    cy.signout();
  });
  it("User clickes search button and user is found", () => {
    cy.get("[data-testid=user-search-input]").type("berouser");
    cy.get("[data-testid=user-search-button]")
      .click()
      .then(() => {
        cy.get(".spinner-border");
      });
    cy.signout();
  });

  it("User is not found", () => {
    cy.get("[data-testid=user-search-input]").type("testuser");
    cy.get("[data-testid=user-search-button]")
      .click()
      .then(() => {
        cy.get(".spinner-border");
        cy.get("[data-testid=invite-guest]");
      });
    cy.signout();
  });
  it.only("User Clickes invite as a guest button", () => {
    cy.get("[data-testid=user-search-input]").type("testuser");
    cy.get("[data-testid=user-search-button]").click();
    cy.get("[data-testid=invite-as-guest-btn]").click();
    cy.get("[data-testid=guest-email]").type("testuser@gmail.com");
  });
  //   it("User clickes invite button");
  //   it("Invitation is sent successfully");
  //   it("User clickes ok button");
  //   it("User is found");
});
