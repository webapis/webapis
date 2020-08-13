import validationMessages from "../../../client/features/authentication/validation/validationMessages";

describe("4_Login_client_side_validation_spec", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("[data-testid=login-link]").click();
  });
  it("user inputs: empty emailorusername or password (onBlur)", () => {
    cy.get("[data-testid=emailorusername]").focus().blur();
    cy.get("[data-testid=password]").focus().blur();
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
  it("user submits: valid emailorusername");
});
