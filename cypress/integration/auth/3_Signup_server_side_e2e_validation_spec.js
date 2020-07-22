import validationMessages from "../../../client/features/authentication/validation/validationMessages";

describe("Signup", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  //node, parse
  it("invalid username, email, password (client side validation)", () => {
    cy.get("[data-testid=username]")
      .type(`123`)
      .blur()
      .get("[data-testid=email]")
      .type(`tkmghouse`)
      .blur()
      .get("[data-testid=password]")
      .type(`1234`)
      .blur();
    cy.get("[data-testid=message-username]").contains(
      validationMessages.INVALID_USERNAME
    );
    cy.get("[data-testid=message-email]").contains(
      validationMessages.INVALID_EMAIL
    );
    cy.get("[data-testid=message-password]").contains(
      validationMessages.INVALID_PASSWORD
    );
  });
});
