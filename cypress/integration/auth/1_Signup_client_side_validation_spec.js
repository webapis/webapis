import validationMessages from "../../../client/features/authentication/validation/validationMessages";

describe("1_Signup_client_side_validation_spec", () => {
  beforeEach(() => {
    cy.window()
      .its("localStorage")
      .invoke("setItem", "browserId", JSON.stringify("1234567890"));
    cy.visit("/");
    cy.get("[data-testid=signup-link]").click();
  });
  //node, parse
  //required
  it("user submits: empty username, email, password (onSubmit)", () => {
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
  //required
  it("user input is: empty username, email, password (onBlur)", () => {
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
  //invalid
  it("user input is:  invalid username,email, or week password (onBlur)", () => {
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
  //valid
  it("user input is valid username,email, password (onBlur)", () => {
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
