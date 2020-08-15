describe("onAccept", () => {
  beforeEach(() => {
    if (Cypress.env("back") === "node") {
      const demouser = {
        username: "demouser",
        email: "demouser@gmail.com",
        password: "Dragonfly1977!!!",
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
  it("invitation accepted successfully", () => {
    const currentDate = Date.UTC(2018, 10, 30);
    cy.clock(currentDate, ["Date"]);
    const hangout = {
      username: "berouser",
      timestamp: currentDate,
      message: { text: "Let's chat berouser", timestamp: currentDate },
      email: "berouser@gmail.com",
      command: "INVITE",
    };

    cy.task("seed:onHangout", {
      hangout,
      senderUsername: "demouser",
      senderEmail: "demouser@gmail.com",
      dbName: "auth",
      collectionName: "users",
    });

    const expectedMessageState = {
      username: "berouser",
      state: "pending",
      timestamp: currentDate,
      text: "Accepted your invitation",
    };
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

    cy.visit("/");
    cy.get("[data-testid=message-count]").contains(1);

    cy.get("[data-testid=unread-link]").click();
    cy.get("[data-testid=demouser]").click();

    cy.get("[data-testid=accept-btn]").click();

    cy.get("[data-testid=message-count]").contains(0);
    cy.window()
      .its("localStorage")
      .invoke("getItem", "berouser-unread-hangouts")
      .then((result) => {
        const messages = JSON.parse(result);
        //test removeUnread()------------------------------------------
      });
    //saveHangout() ACCEPT------------------------------------------
    //saveSentMessage(dState:'pending')-----------------------------
    cy.get("[data-testid=hangchat-ui]").then(() => {
      cy.get("[data-testid=right-message-wrapper]")
        .find(".message-state")
        .contains("pending");
    });
    cy.get("[data-testid=message-count]").contains(0);
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid=message]")
      .contains("Let's chat berouser");
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid=message-sender]")
      .contains("demouser");
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid=time]")
      .contains("Now");

    cy.get("[data-testid=right-message-wrapper]")
      .find("[data-testid=message]")
      .contains("Accepted your invitation");
    cy.get("[data-testid=right-message-wrapper]")
      .find("[data-testid=message-sender]")
      .contains("me");
    cy.get("[data-testid=right-message-wrapper]")
      .find("[data-testid=time]")
      .contains("Now");
    //updateSentMessage(dState:'delivered')------------------------------
    //updateHangout(ACCEPTED)--------------------------------------------
    cy.get("[data-testid=right-message-wrapper]")
      .find(".message-state")
      .contains("delivered");
    //saveRecievedMessage(dState:'read')---------------------------------
    cy.get("[data-testid=left-message-wrapper]")
      .find(".message-state")
      .contains("read");
  });
});
