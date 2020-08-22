describe("onInvite", () => {
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
    //  cy.visit("/");
  });
  it("invite success", () => {
    const currentDate = Date.UTC(2018, 10, 30);
    cy.clock(currentDate, ["Date"]);
    cy.signup({ username: "demouser" });

    cy.signout();

    cy.signup({ username: "berouser" });
    cy.signout();

    cy.login({ username: "demouser" });
    // cy.get("[data-testid=hangouts-link]").click();

    cy.get("[data-testid=search]").click();
    cy.get("[data-testid=search-ui]");
    cy.get("[data-testid=search-input]").type("berouser");

    cy.get("[data-testid=search-btn]").click();

    cy.get("[data-testid=berouser]").click();
    cy.get("[data-testid=invite-ui]");
    cy.get("[data-testid=messageTextInput]").should(
      "have.value",
      "Let's chat, berouser!"
    );

    cy.get("[data-testid=messageTextInput]").clear();
    cy.get("[data-testid=messageTextInput]").type("Lets chat on Hangout");
    const expectedHangoutState = {
      username: "berouser",
      email: "berouser@gmail.com",
      state: "INVITE",
      timestamp: currentDate,
      message: { text: "Lets chat on Hangout", timestamp: currentDate },
    };
    const expectedMessageState = {
      username: "demouser",
      state: "pending",
      timestamp: currentDate,
      text: "Lets chat on Hangout",
    };

    cy.get("[data-testid=oninvite-btn]")
      .click()
      .then(() => {
        cy.window()
          .its("localStorage")
          .invoke("getItem", "demouser-berouser-messages")
          .then((result) => {
            const messages = JSON.parse(result);
            const pending = messages[0];
            //testing saveSentMessagsage()-------------------------------1
            expect(pending).to.deep.equal(expectedMessageState);
          });
        cy.window()
          .its("localStorage")
          .invoke("getItem", "demouser-hangouts")
          .then((result) => {
            const hangout = JSON.parse(result);
            const devlivered = hangout[0];
            //testing SaveHangout()---------------------------------------2
            expect(devlivered).to.deep.equal({
              ...expectedHangoutState,
              state: "INVITE",
            });
          });
      });

    cy.get("[data-testid=invitee-ui]");
    cy.get(".invited");
    cy.window()
      .its("localStorage")
      .invoke("getItem", "demouser-berouser-messages")
      .then((result) => {
        const messages = JSON.parse(result);
        const devlivered = messages[0];
        //testing updateSentMessage()-------------------------------3
        expect(devlivered).to.deep.equal({
          ...expectedMessageState,
          state: "delivered",
        });
      });
    cy.window()
      .its("localStorage")
      .invoke("getItem", "demouser-hangouts")
      .then((result) => {
        const hangout = JSON.parse(result);
        const devlivered = hangout[0];
        //testing updateHangout()---------------------------------------4
        expect(devlivered.state).to.deep.equal("INVITED");
      });
    //inviter logges in from hist second device(browser)
    cy.get("[data-testid=signout-link]").click();
    cy.visit("/");
    cy.window()
      .its("localStorage")
      .invoke("setItem", "demouser-browserId", "1234567890");
    cy.window().its("localStorage").invoke("removeItem", "demouser-hangouts");
    cy.window()
      .its("localStorage")
      .invoke("removeItem", "demouser-berouser-messages");
    cy.login({ username: "demouser" });
    cy.get("[data-testid=hangouts-link]").click();
    cy.get("[data-testid=berouser]");
  });
});
