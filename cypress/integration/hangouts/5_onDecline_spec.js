describe("onDecline", () => {
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
  it("invitation declined successfully", () => {
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

    cy.get("[data-testid=message-count]").contains(1);
    cy.get("[data-testid=unread-link]").click();
    cy.get("[data-testid=demouser]").should("have.length", 1);
    cy.get(".badge-primary").contains(1);
    cy.get("[data-testid=demouser]").click();
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid]")
      .contains("Let's chat, berouser!");
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid=message-sender]")
      .contains("demouser");
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid=time]")
      .contains("Now");

    cy.get("[data-testid=decline-btn]").click();
    cy.get("[data-testid=declined-ui]");
    cy.get("[data-testid=message-count]").contains(0);
  });
});
