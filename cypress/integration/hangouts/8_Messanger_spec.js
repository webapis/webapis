describe("onMessage_spec", () => {
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
  it("message is sent succefully", () => {
    // const timestamp = Date.UTC(2018, 10, 30);
    // cy.clock(timestamp, ["Date"]);
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
    cy.get("[data-testid=unread-link]").contains(1);
    cy.get("[data-testid=unread-link]").click();
    cy.get("[data-testid=berouser]").click();
    cy.wait(2000);
    cy.get("[data-testid=message-input]").type("Hello berouser");
    cy.get("[data-testid=send-btn]").click();
    cy.signout();
    cy.login({ username: "berouser" });

    cy.get("[data-testid=message-count]").contains(1); ///?
    cy.get("[data-testid=hangouts-link]").click();

    cy.get("[data-testid=demouser]").click();
    cy.get("[data-testid=message-count]").contains(0);

    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid=message]")
      .contains("Hello berouser");
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid=message-sender]")
      .contains("demouser");
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid=time]")
      .contains("Now");
  });
});
