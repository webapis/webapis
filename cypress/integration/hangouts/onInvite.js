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
    cy.visit("/");
    cy.wait(50);
    cy.get("[data-testid=hangouts-link]").click();
    cy.get("[data-testid=search-link]").click();
    cy.get("[data-testid=search-input]").type("bero");
    cy.get("[data-testid=search-btn]").click();
    cy.get("[data-testid=bero]").click();
    cy.get("[data-testid=invite-ui]");
    cy.get("[data-testid=messageTextInput]").type("Lets chat on Hangout");

    cy.get("[data-testid=oninvite-btn]").click();
    cy.get("[data-testid=invitee-ui]");
    cy.window()
      .its("localStorage")
      .invoke("getItem", "demo-hangouts")
      .then((result) => {
        const hangout = JSON.parse(result);
        const { state } = hangout[0];
        expect(state).to.deep.equal("INVITED");
      });

    cy.get("[data-testid=hangouts-link]").click();
    cy.get("[data-testid=bero]").click();
    cy.get("[data-testid=invitee-ui]");
  });
});
