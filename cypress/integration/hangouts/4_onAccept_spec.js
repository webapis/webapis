describe("onAccept", () => {
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
  it("invitation accepted successfully", () => {
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
    cy.get("[data-testid=unread-link]");
    cy.get("[data-testid=unread-link]")
      .find("[data-testid=message-count]")
      .contains(1);
    cy.wait(200);
    cy.get("[data-testid=unread-link]").click();
    cy.get("[data-testid=demouser]").click();

    cy.get("[data-testid=accept-btn]").click();
    cy.get("[data-testid=right-message-wrapper]")
      .find("[data-testid=message-state]")
      //saveSentMessage(dState:'pending')-----------------------------2.1
      .contains("pending");
    // .then(() => {
    // cy.get("[data-testid=right-message-wrapper]")
    //   .find("[data-testid=message-state]")
    //   //saveSentMessage(dState:'pending')-----------------------------2.1
    //   .contains("pending");
    // cy.window()
    //   .its("localStorage")
    //   .invoke("getItem", "berouser-hangouts")
    //   .then((hangoutState) => {
    //     const expectedHangoutState = {
    //       username: "demouser",
    //       email: "demouser@gmail.com",
    //       message: {
    //         text: "Accepted your invitation",
    //         timestamp: 1543536000000,
    //       },
    //       timestamp: 1543536000000,
    //       state: "ACCEPT",
    //     };
    //     //saveHangout() ACCEPT------------------------------------------1
    //     expect(JSON.parse(hangoutState)[0]).to.deep.equal(
    //       expectedHangoutState
    //     );
    //   });

    // cy.window()
    //   .its("localStorage")
    //   .invoke("getItem", "berouser-demouser-messages")
    //   .then((result) => {
    //     const recievedMessageState = JSON.parse(result).find(
    //       (r) => r.username === "demouser"
    //     );
    //     const sentMessageState = JSON.parse(result).find(
    //       (r) => r.username === "berouser"
    //     );
    //     const expectedSentMessageState = {
    //       text: "Accepted your invitation",
    //       timestamp: 1543536000000,
    //       username: "berouser",
    //       state: "pending",
    //     };

    //     const expectedRecievedMessageState = {
    //       text: "Let's chat, berouser!",
    //       timestamp: 1543536000000,
    //       username: "demouser",
    //       state: "read",
    //     };
    //     //saveSentMessage() "pending"-------------------------------------2
    //     expect(sentMessageState).to.deep.equal(expectedSentMessageState);
    //     //saveRecievedMessage()dState:'read'-------------------------------------------3
    //     expect(recievedMessageState).to.deep.equal(
    //       expectedRecievedMessageState
    //     );
    //     cy.get("[data-testid=message-count]").contains(0);
    //   });
    // });
    cy.get("[data-testid=unread-link]");
    cy.get("[data-testid=unread-link]")
      .find("[data-testid=message-count]")
      .contains(0);
    cy.wait(200);
    //saveRecievedMessage(dState:'read')---------------------------------3.1
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid=message]")
      .contains("Let's chat, berouser!");
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid=message-sender]")
      .contains("demouser");
    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid=message-state]")
      .contains("read");

    cy.get("[data-testid=left-message-wrapper]")
      .find("[data-testid=time]")
      .contains("Now");

    cy.get("[data-testid=right-message-wrapper]")
      .find("[data-testid=message]")
      .contains("Accepted your invitation");
    // cy.get("[data-testid=right-message-wrapper]")
    //   .find("[data-testid=message-sender]")
    //   .contains("me");
    cy.get("[data-testid=right-message-wrapper]")
      .find("[data-testid=time]")
      .contains("Now");
    //updateSentMessage(dState:'delivered')------------------------------
    //updateHangout(ACCEPTED)--------------------------------------------
    cy.get("[data-testid=right-message-wrapper]")
      .find("[data-testid=message-state]")
      .contains("delivered");
  });
});
