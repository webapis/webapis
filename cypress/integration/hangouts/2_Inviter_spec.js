const { JsonWebTokenError } = require("jsonwebtoken");

describe("Inviter", () => {
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
    const currentDate = Date.UTC(2018, 10, 30);
    cy.clock(currentDate, ["Date"]);

    let timestamp = currentDate;
    cy.signup({ username: "demouser" });

    cy.signout();

    cy.signup({ username: "berouser" });

    cy.signout();

    cy.login({ username: "demouser" });
    cy.invite();
    cy.signout();

    cy.login({ username: "berouser" });

    const expectedHangoutState = {
      username: "demouser",
      email: "demouser@gmail.com",
      state: "INVITER",
      timestamp: currentDate,
      message: { text: "Let's chat, berouser!", timestamp: currentDate },
    };

    // const expectedMessageState = {
    //   username: "demouser",
    //   state: "pending",
    //   timestamp: currentDate,
    //   text: "Let's chat, berouser!",
    // };

    cy.get("[data-testid=message-count]")
      .contains(1)
      .then(() => {
        cy.window()
          .its("localStorage")
          .invoke("getItem", "berouser-unread-hangouts")
          .then((result) => {
            const unreads = JSON.parse(result);
            const pending = unreads[0];
            // testing saveUnread() ---------------------------------
            expect(pending).to.deep.equal(expectedHangoutState);
          });

        cy.get("[data-testid=unread-link]").click();
        cy.get("[data-testid=demouser]").click();
        cy.get("[data-testid=message]").contains("Let's chat, berouser!");
        cy.get("[data-testid=message-sender]").contains("demouser");
        cy.get("[data-testid=time]").contains("Now");
      });
  });
});
