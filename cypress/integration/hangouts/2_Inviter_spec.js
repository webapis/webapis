describe("Inviter", () => {
  beforeEach(() => {
    if (Cypress.env("back") === "node") {
      const demo = {
        username: "demo",
        email: "demo@gmail.com",
        password: "Dragonly_1999!",
      };
      const bero = {
        username: "bero",
        email: "bero@gmail.com",
        password: "Dragonly_1999!",
      };
      cy.task("seed:deleteCollection", {
        dbName: "auth",
        collectionName: "users",
      });
      cy.task("seed:user", demo);
      cy.task("seed:user", bero);
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
      username: "bero",
      timestamp,
      message: { text: "Hello bero let's chat", timestamp },
      email: "bero@gmail.com",
      command: "INVITE",
    };

    cy.task("seed:onHangout", {
      hangout: inviter,
      senderUsername: "demo",
      senderEmail: "demo@gmail.com",
      dbName: "auth",
      collectionName: "users",
    });

    if (Cypress.env("back") === "node") {
      cy.loginByEmail({
        email: "bero@gmail.com",
        password: "Dragonly_1999!",
      });
    }
    const expectedHangoutState = {
      username: "demo",
      email: "demo@gmail.com",
      state: "INVITER",
      timestamp: currentDate,
      message: { text: "Hello bero let's chat", timestamp: currentDate },
    };

    const expectedMessageState = {
      username: "demo",
      state: "pending",
      timestamp: currentDate,
      text: "Hello bero let's chat",
    };
    cy.visit("/");
    cy.get("[data-testid=message-count]").contains(1);
    cy.window()
      .its("localStorage")
      .invoke("getItem", "bero-unread-hangouts")
      .then((result) => {
        const unreads = JSON.parse(result);
        const pending = unreads[0];
        debugger;
        expect(pending).to.deep.equal(expectedHangoutState);
      });

    cy.window()
      .its("localStorage")
      .invoke("getItem", "bero-demo-messages")
      .then((result) => {
        const messages = JSON.parse(result);
        const pending = messages[0];
        debugger;
        expect(pending).to.deep.equal({
          ...expectedMessageState,
          state: "unread",
        });
      });

    cy.get("[data-testid=unread-link]").click();
    cy.get("[data-testid=demo]").click();
    cy.get("[data-testid=message]").contains("Hello bero let's chat");
    cy.get("[data-testid=message-sender]").contains("demo");
    cy.get("[data-testid=time]").contains("Now");
  });
});
