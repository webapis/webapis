describe("Accepter", () => {
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
    cy.visit("/");
  });
  it("Accepter succeful", () => {
    const timestamp = Date.UTC(2018, 10, 30);
    cy.clock(timestamp, ["Date"]);

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
    cy.get("[data-testid=unread-link]");
    cy.get("[data-testid=unread-link]").contains(0);

    cy.get("[data-testid=unread-link]")
      .click()
      .then(() => {
        cy.get("[data-testid=berouser]").should("have.length", 1);
        cy.get(".badge-primary").contains(1);
        cy.get("[data-testid=berouser]").click();
        cy.get("[data-testid=message]").contains("Accepted your invitation");
        cy.get("[data-testid=message-sender]").contains("berouser");
        cy.get("[data-testid=time]").contains("Now");
        cy.get("[data-testid=left-message-wrapper]")
          .find(".message-state")
          .contains("read");
      });
  });
});
