import validationMessages from "../../../client/features/authentication/validation/validationMessages";
describe("Client Side validation", () => {
  it("user submits: empty username, email, password (onSubmit)", () => {
    cy.visit("https://localhost:3009");
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
[3008, 3009].forEach((PORT) => {
  describe(`Test server side validation with ${
    PORT === 3008 ? "AuthMockSerive" : "AuthNodeJsService"
  }`, () => {
    beforeEach(() => {
      cy.task("seed:deleteCollection", {
        dbName: "auth",
        collectionName: "users",
      });
      cy.server();
      cy.window()
        .its("localStorage")
        .invoke("setItem", "browserId", JSON.stringify("1234567890"));
    });
    it("client side JS disabled: user submmits empty fields", () => {
      cy.emptyFields({ PORT });
    });

    it("client side JS disabled: user submits invalid username,email, or week password", () => {
      cy.invalidFields({ PORT });
    });

    it("user enters taken username", () => {
      cy.takenUserName({ PORT });
    });
    it("user enters taken email", () => {
      cy.takenEmail({ PORT });
    });
    it("user enters taken email and username", () => {
      cy.existingUser({ PORT });
    });
  });
});
