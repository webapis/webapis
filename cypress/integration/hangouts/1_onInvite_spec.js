describe("onInvite", () => {
  beforeEach(() => {
    if (Cypress.env("back") === "node") {
      const demo = {
        username: "demo",
        email: "demo@gmail.com",
        password: "Dragonfly1977!!!",
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
  it("invite success", () => {
    if (Cypress.env("back") === "node") {
      cy.loginByEmail({
        email: "demo@gmail.com",
        password: "Dragonfly1977!!!",
      });
    }
    if (Cypress.env("back") === "parse") {
      cy.signupParse({
        username: "demo",
        email: "demo@gmail.com",
        password: "Dragonfly2020_!",
      });
      cy.createUser({
        username: "bero",
        email: "bero@gmail.com",
        password: "Dragonfly2020_!",
      });
    }
    const currentDate = Date.UTC(2018, 10, 30);
    cy.clock(currentDate, ["Date"]);

    cy.visit("/");
    cy.wait(50);
    cy.get("[data-testid=hangouts-link]").click();
    cy.get("[data-testid=search-link]").click();
    cy.get("[data-testid=search-input]").type("bero");
    cy.get("[data-testid=search-btn]").click();
    cy.get("[data-testid=bero]").click();
    cy.get("[data-testid=invite-ui]");
    cy.get("[data-testid=messageTextInput]").should(
      "have.value",
      "Let's chat, bero!"
    );

    cy.get("[data-testid=messageTextInput]").clear();
    cy.get("[data-testid=messageTextInput]").type("Lets chat on Hangout");

    cy.get("[data-testid=oninvite-btn]").click();
    const expectedHangoutState = {
      username: "bero",
      email: "bero@gmail.com",
      state: "INVITE",
      timestamp: currentDate,
      message: { text: "Lets chat on Hangout", timestamp: currentDate },
    };
    const expectedMessageState = {
      username: "demo",
      state: "pending",
      timestamp: currentDate,
      text: "Lets chat on Hangout",
    };
    cy.window()
      .its("localStorage")
      .invoke("getItem", "demo-hangouts")
      .then((result) => {
        const hangout = JSON.parse(result);
        const pending = hangout[0];

        expect(pending).to.deep.equal(expectedHangoutState);
        cy.get("[data-testid=spinner]").should("be.visible");
        cy.get("[data-testid=messageTextInput]").should("be.disabled");
      });
    cy.window()
      .its("localStorage")
      .invoke("getItem", "demo-bero-messages")
      .then((result) => {
        const messages = JSON.parse(result);
        const pending = messages[0];
        expect(pending).to.deep.equal(expectedMessageState);
      });
    cy.get("[data-testid=invitee-ui]");

    cy.window()
      .its("localStorage")
      .invoke("getItem", "demo-hangouts")
      .then((result) => {
        const hangout = JSON.parse(result);
        const devlivered = hangout[0];
        expect(devlivered).to.deep.equal({
          ...expectedHangoutState,
          state: "INVITED",
        });
      });
    cy.window()
      .its("localStorage")
      .invoke("getItem", "demo-bero-messages")
      .then((result) => {
        const messages = JSON.parse(result);
        const pending = messages[0];
        expect(pending).to.deep.equal({
          ...expectedMessageState,
          state: "delivered",
        });
      });
    cy.get("[data-testid=hangouts-link]").click();
    cy.get("[data-testid=bero]").click();
    cy.get("[data-testid=invitee-ui]");
  });
});
