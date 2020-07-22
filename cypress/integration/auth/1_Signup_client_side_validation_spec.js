import validationMessages from "../../../client/features/authentication/validation/validationMessages";

describe("1_Signup_client_side_validation_spec", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("[data-testid=signup-link]").click();
  });
  //node, parse
  it("user clicks signup btn without touching any fields", () => {
    cy.get("[data-testid=signup-link]").click();
    cy.get("[data-testid=signup-btn]").click();
    cy.get("[data-testid=message-username]").contains(
      validationMessages.REQUIRED_FIELD
    );
    cy.get("[data-testid=message-email]").contains(
      validationMessages.REQUIRED_FIELD
    );
    cy.get("[data-testid=message-password]").contains(
      validationMessages.REQUIRED_FIELD
    );
  });
  //node, parse
  it("user focuses on input but leaves it empty", () => {
    cy.get("[data-testid=username]")
      .focus()
      .blur()
      .get("[data-testid=email]")
      .focus()
      .blur()
      .get("[data-testid=password]")
      .focus()
      .blur();

    cy.get("[data-testid=message-username]").contains(
      validationMessages.REQUIRED_FIELD
    );
    cy.get("[data-testid=message-email]").contains(
      validationMessages.REQUIRED_FIELD
    );
    cy.get("[data-testid=message-password]").contains(
      validationMessages.REQUIRED_FIELD
    );
  });
  //node, parse
  it("user enters invalid username,email, or week password", () => {
    cy.get("[data-testid=username]")
      .type("123")
      .blur()
      .get("[data-testid=email]")
      .type("testemail.com")
      .blur()
      .get("[data-testid=password]")
      .type("123")
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
  //node, parse
  it("user enters valid username,email, password", () => {
    cy.get("[data-testid=username]")
      .type("testuser")
      .blur()
      .get("[data-testid=email]")
      .type("test@email.com")
      .blur()
      .get("[data-testid=password]")
      .type("DragonfDragon2020!")
      .blur();

    cy.get("[data-testid=message-username]").should("not.be.visible");
    cy.get("[data-testid=message-email]").should("not.be.visible");
    cy.get("[data-testid=message-password]").should("not.be.visible");
  });
});
