import validationMessages from "../../../client/features/authentication/validation/validationMessages";
//3008,3009,3011
[3011].forEach((PORT) => {
  describe("Client side login tests", () => {
    it("user inputs: empty emailorusername or password (onBlur)", () => {
      cy.visit(`https://localhost:${PORT}`);

      // cy.get("[data-testid=signin-link]").click();
      cy.get("[data-testid=emailorusername]").focus();

      cy.wait(500);
      cy.get("[data-testid=emailorusername]").blur();
      cy.get("[data-testid=password]").focus();
      cy.wait(500);
      cy.get("[data-testid=password]").blur();
      cy.get("[data-testid=message-emailorusername]").contains(
        validationMessages.REQUIRED_FIELD
      );
      cy.get("[data-testid=message-password]").contains(
        validationMessages.REQUIRED_FIELD
      );
    });

    it("user submits: empty emailorusername or password(onLogin)", () => {
      cy.visit(`https://localhost:${PORT}`);
      cy.get("[data-testid=signin-btn]").click();
      cy.get("[data-testid=message-emailorusername]").contains(
        validationMessages.REQUIRED_FIELD
      );
      cy.get("[data-testid=message-password]").contains(
        validationMessages.REQUIRED_FIELD
      );
    });

    it("user inputs: invalid emailorusername ", () => {
      cy.visit(`https://localhost:${PORT}`);
      cy.get("[data-testid=emailorusername]").type("@312-*/").blur();
      cy.get("[data-testid=message-emailorusername]").contains(
        validationMessages.INVALID_USERNAME_OR_EMAIL
      );
    });
  });
  describe(`Login validation with ${
    PORT === 3008 ? "AuthMockService" : "AuthNodeJsService"
  }   `, () => {
    beforeEach(() => {
      cy.server();

      Cypress.on("window:before:load", (win) => {
        win.jsDisabled = true;
      });
      cy.window()
        .its("localStorage")
        .invoke("setItem", "browserId", JSON.stringify("1234567899"));
    });
    it("user submits: empty emailorusername or password (219) client JSDisabled", () => {
      cy.emptyFields({ PORT });
    });
    it("user submits: invalid emailorusername (218) client JSDisabled", () => {
      cy.invalidEmailOrUsername({ PORT });
    });
    it("user submits :non existent usernameoremail (212)", () => {
      cy.noneExistingUser({ PORT });
    });
    it("user submits: matching emailorusername and wrong password (212)", () => {
      cy.wrongPassword({ PORT });
    });

    it.only("Successful Login", () => {
      cy.successfulLogin({ PORT });
    });
  });
});
