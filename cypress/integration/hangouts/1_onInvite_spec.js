describe("onInvite", () => {
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
  it("invite success", () => {
    if (Cypress.env("back") === "node") {
      cy.loginByEmail({
        email: "demouser@gmail.com",
        password: "Dragonfly1977!!!",
        hasBrowserId: false,
      });
    }
    if (Cypress.env("back") === "parse") {
      cy.signupParse({
        username: "demouser",
        email: "demouser@gmail.com",
        password: "Dragonfly2020_!",
      });
      cy.createUser({
        username: "berouser",
        email: "berouser@gmail.com",
        password: "Dragonfly2020_!",
      });
    }
    const currentDate = Date.UTC(2018, 10, 30);
    cy.clock(currentDate, ["Date"]);

    cy.visit("/");

    cy.wait(50);
    cy.get("[data-testid=hangouts-link]").click();
    cy.get("[data-testid=search-link]").click();

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
    cy.get("[data-testid=socket-connection]").contains("connected");

    cy.get("[data-testid=oninvite-btn]")
      .click()
      .then(() => {
        cy.window()
          .its("localStorage")
          .invoke("getItem", "demouser-berouser-messages")
          .then((result) => {
            const messages = JSON.parse(result);
            const pending = messages[0];
            //testing saveSentMessagsage()-------------------------------
            expect(pending).to.deep.equal(expectedMessageState);
          });
      });

    cy.get("[data-testid=invitee-ui]");
    cy.window()
      .its("localStorage")
      .invoke("getItem", "demouser-hangouts")
      .then((result) => {
        const hangout = JSON.parse(result);
        const devlivered = hangout[0];
        //testing SaveHangout()---------------------------------------
        expect(devlivered).to.deep.equal({
          ...expectedHangoutState,
          state: "INVITE",
        });
      });

    cy.window()
      .its("localStorage")
      .invoke("getItem", "demouser-berouser-messages")
      .then((result) => {
        const messages = JSON.parse(result);
        const pending = messages[0];
        //testing updateSentMessage()-------------------------------
        expect(pending).to.deep.equal({
          ...expectedMessageState,
          state: "pending",
        });
      });

    cy.get("[data-testid=hangouts-link]").click();
    cy.get("[data-testid=berouser]").click();
    cy.get("[data-testid=invitee-ui]");
    cy.window()
      .its("localStorage")
      .invoke("getItem", "demouser-berouser-messages")
      .then((result) => {
        const messages = JSON.parse(result);
        const pending = messages[0];
        //testing updateSentMessage()-------------------------------
        expect(pending).to.deep.equal({
          ...expectedMessageState,
          state: "delivered",
        });
      });

    cy.get("[data-testid=signout-link]").click();
    cy.visit("/");

    cy.window()
      .its("localStorage")
      .invoke("setItem", "demouser-browserId", "1234567890");
    cy.window().its("localStorage").invoke("removeItem", "demouser-hangouts");
    cy.window()
      .its("localStorage")
      .invoke("removeItem", "demouser-berouser-messages");
    cy.get("[data-testid=login-link]").click();
    cy.get("[data-testid=emailorusername]").type("demouser");
    cy.get("[data-testid=password]").type("Dragonfly1977!!!");
    cy.pause();
    cy.get("[data-testid=login-btn]").click();
  });
});
