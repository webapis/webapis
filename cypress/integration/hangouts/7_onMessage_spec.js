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
    // cy.visit("/");
  });
  it("message is sent succefully", () => {
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
    cy.get("[data-testid=unread-link]")
      .find("[data-testid=message-count]")
      .contains(1);
    cy.wait(200);
    cy.get("[data-testid=unread-link]").click();
    cy.get("[data-testid=berouser]").click();
    let msg = "Hello berouser";
    cy.get("[data-testid=message-input]").type(msg);
    cy.get("[data-testid=send-btn]").click();
    cy.wait(50);
    cy.get("[data-testid=right-message-wrapper]")
      .last()
      .find("[data-testid=message]")
      .contains(msg);

    // cy.get("[data-testid=right-message-wrapper]")
    //   .find("[data-testid=message-sender]")
    //   .contains("me");
    cy.get("[data-testid=right-message-wrapper]")
      .find("[data-testid=time]")
      .contains("Now");
    cy.get("[data-testid=message-input]").should("have.value", "");

    cy.signout();
    cy.login({ username: "berouser" });
    cy.get("[data-testid=unread-link]");
    cy.get("[data-testid=unread-link]")
      .find("[data-testid=message-count]")
      .contains(1);
    cy.wait(200);
    cy.get("[data-testid=unread-link]").click();

    cy.get("[data-testid=demouser]").click();

    cy.get("[data-testid=message-input]").type("What are you doing demouser");
    cy.get("[data-testid=send-btn]").click();

    cy.signout();
    cy.login({ username: "demouser" });
    cy.get("[data-testid=unread-link]").contains(1);
    cy.wait(200);
    cy.get("[data-testid=unread-link]").click();
    cy.get("[data-testid=berouser]").click();
  });
});
