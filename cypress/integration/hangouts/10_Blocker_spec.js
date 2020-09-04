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
    // cy.visit("/");
  });
  it("blocker recieved succefully", () => {
    // const currentDate = Date.UTC(2018, 10, 30);
    // cy.clock(currentDate, ["Date"]);

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
    //     cy.get("[data-testid=unread-link]").find("[data-testid=message-count]")
    //     .contains(1);
    // cy.wait(200)
    cy.get("[data-testid=unread-link]").should("be.visible");
    cy.wait(2000);
    cy.get("[data-testid=unread-link]")
      .click()
      .then(() => {
        cy.get("[data-testid=unread-ui]")
          .should("be.visible")
          .find("[data-testid=berouser]")
          .click();

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
});
