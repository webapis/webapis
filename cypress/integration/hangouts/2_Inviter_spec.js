describe("Inviter", () => {
  beforeEach(() => {
    if (Cypress.env("back") === "node") {
      const demouser = {
        username: "demouser",
        email: "demouser@gmail.com",
        password: "Dragonly_1999!",
      };
      const berouser = {
        username: "berouser",
        email: "berouser@gmail.com",
        password: "Dragonly_1999!",
      };
      cy.task("seed:deleteCollection", {
        dbName: "auth",
        collectionName: "users",
      });
      cy.task("seed:user", demouser);
      cy.task("seed:user", berouser);
    }
    if (Cypress.env("back") === "parse") {
      cy.task("seed:dropDatabase", {
        dbName: "test",
      });
    }
  });
  it("message is sent succefully", () => {
    const currentDate = Date.UTC(2018, 10, 30);
    cy.clock(currentDate, ["Date"]);
    let timestamp = currentDate;
    const inviter = {
      username: "berouser",
      timestamp,
      message: { text: "Hello berouser let's chat", timestamp },
      email: "berouser@gmail.com",
      command: "INVITE",
    };

    cy.task("seed:onHangout", {
      hangout: inviter,
      senderUsername: "demouser",
      senderEmail: "demouser@gmail.com",
      dbName: "auth",
      collectionName: "users",
    });

    cy.window()
      .its("localStorage")
      .invoke("setItem", "berouser-browserId", "1234567890");

    if (Cypress.env("back") === "node") {
      cy.loginByEmail({
        email: "berouser@gmail.com",
        password: "Dragonly_1999!",
        hasBrowserId: true,
      });
    }
    const expectedHangoutState = {
      username: "demouser",
      email: "demouser@gmail.com",
      state: "INVITER",
      timestamp: currentDate,
      message: { text: "Hello berouser let's chat", timestamp: currentDate },
    };

    const expectedMessageState = {
      username: "demouser",
      state: "pending",
      timestamp: currentDate,
      text: "Hello berouser let's chat",
    };
    cy.visit("/");

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
        cy.get("[data-testid=message]").contains("Hello berouser let's chat");
        cy.get("[data-testid=message-sender]").contains("demouser");
        cy.get("[data-testid=time]").contains("Now");
      });
  });
});
