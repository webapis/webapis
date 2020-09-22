import validationMessages from "../../../client/features/authentication/validation/validationMessages";
describe("Client side login tests", () => {
  it("user inputs: empty emailorusername or password (onBlur)", () => {
    cy.visit("https://localhost:3008");
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
    cy.get("[data-testid=login-btn]").click();
    cy.get("[data-testid=message-emailorusername]").contains(
      validationMessages.REQUIRED_FIELD
    );
    cy.get("[data-testid=message-password]").contains(
      validationMessages.REQUIRED_FIELD
    );
  });

  it("user inputs: invalid emailorusername ", () => {
    cy.get("[data-testid=emailorusername]").type("@312-*/").blur();
    cy.get("[data-testid=message-emailorusername]").contains(
      validationMessages.INVALID_USERNAME_OR_EMAIL
    );
  });
});

describe("Login validation with  AuthMockService ", () => {
  beforeEach(() => {
    cy.server();

    Cypress.on("window:before:load", (win) => {
      win.jsDisabled = true;
    });
  });
  it("user submits: empty emailorusername or password (219) client JSDisabled", () => {
    cy.emptyFields({ PORT: 3008 });
  });
  it("user submits: invalid emailorusername (218) client JSDisabled", () => {
    cy.invalidEmailOrUsername({ PORT: 3008 });
  });
  it("user submits :non existent usernameoremail (212)", () => {
    cy.noneExistingUser({ PORT: 3008 });
  });
  it("user submits: matching emailorusername and wrong password (212)", () => {
    cy.wrongPassword({ PORT: 3008 });
  });
});
