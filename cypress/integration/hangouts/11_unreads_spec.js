describe("onUnreadSelect", () => {
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
  it("unreads length equal to 1", () => {
    let timestamp = Date.now();
    const inviter = {
      username: "bero",
      timestamp,
      message: { text: "Hello bero letschat", timestamp },
      email: "bero@gmail.com",
      command: "INVITE",
    };

    cy.task("seed:onHangout", {
      hangout: inviter,
      senderUsername: "demo",
      dbName: "auth",
      collectionName: "users",
    });

    const accepter = {
      username: "demo",
      timestamp,
      message: { text: "Your invitation is accepted", timestamp },
      email: "demo@gmail.com",
      command: "ACCEPT",
    };

    cy.task("seed:onHangout", {
      hangout: accepter,
      senderUsername: "bero",
      dbName: "auth",
      collectionName: "users",
    });
    let messageTimeStamp = Date.now();
    const messanger = {
      username: "demo",
      timestamp: messageTimeStamp,
      message: { text: "Hello demo", timestamp: messageTimeStamp },
      email: "demo@gmail.com",
      command: "MESSAGE",
    };

    cy.task("seed:onHangout", {
      hangout: messanger,
      senderUsername: "bero",
      dbName: "auth",
      collectionName: "users",
    });
    if (Cypress.env("back") === "node") {
      cy.loginByEmail({
        email: "demo@gmail.com",
        password: "Dragonly_1999!",
      });
    }

    cy.visit("/");
    cy.get("[data-testid=message-count]").contains(2);
    cy.get("[data-testid=unread-link]").click();

    // test onReduce()-------------------------------------------------
    cy.get("[data-testid=bero]").should("have.length", 1);
    cy.get(".badge-primary").contains(2);

    cy.get("[data-testid=bero]").click();
    // test removeUnreads()-----------------------------------
    cy.get("[data-testid=message-count]").contains(0);
  });
});
