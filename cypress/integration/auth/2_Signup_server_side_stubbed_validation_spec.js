import validationMessages from "../../../client/features/authentication/validation/validationMessages";

describe("2_Signup_server_side_stubbed_validation_spec", () => {
  beforeEach(() => {
    cy.server();
    cy.visit("/");
    cy.get("[data-testid=signup-link]").click();
  });
  it("client side JS disabled: user submmits empty fields", () => {
    cy.route({
      url: "/auth/signup",
      method: "POST",
      status: 400,
      response: { errors: [205, 207, 208] },
    });

    cy.get("[data-testid=username]")
      .type("testuser")
      .get("[data-testid=email]")
      .type("testuser@gmail.com")
      .get("[data-testid=password]")
      .type("TestPassword2020!")
      .blur();
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

  it("client side JS disabled: user submits invalid username,email, or week password", () => {
    cy.route({
      url: "/auth/signup",
      method: "POST",
      status: 400,
      response: { errors: [210, 211, 209] },
    });

    cy.get("[data-testid=username]")
      .type("testuser")
      .get("[data-testid=email]")
      .type("testuser@gmail.com")
      .get("[data-testid=password]")
      .type("TestPassword2020!")
      .blur();
    cy.get("[data-testid=signup-btn]").click();
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
  it("user enters taken username", () => {
    cy.route({
      url: "/auth/signup",
      method: "POST",
      status: 400,
      response: { errors: [213] },
    });
    cy.get("[data-testid=username]")
      .type("testuser")
      .get("[data-testid=email]")
      .type("testuser@gmail.com")
      .get("[data-testid=password]")
      .type("TestPassword2020!")
      .blur();
    cy.get("[data-testid=signup-btn]").click();
    cy.get("[data-testid=message-username]").contains(
      validationMessages.USERNAME_TAKEN
    );
    cy.get("[data-testid=message-email]").should("not.be.visible");
    cy.get("[data-testid=message-password]").should("not.be.visible");
  });
  it("user enters taken email", () => {
    cy.route({
      url: "/auth/signup",
      method: "POST",
      status: 400,
      response: { errors: [214] },
    });
    cy.get("[data-testid=username]")
      .type("testuser")
      .get("[data-testid=email]")
      .type("testuser@gmail.com")
      .get("[data-testid=password]")
      .type("TestPassword2020!")
      .blur();
    cy.get("[data-testid=signup-btn]").click();
    cy.get("[data-testid=message-username]").should("not.be.visible");
    cy.get("[data-testid=message-email]").contains(
      validationMessages.REGISTERED_EMAIL
    );
    cy.get("[data-testid=message-password]").should("not.be.visible");
  });
  it.only("user enters taken email and username", () => {
    cy.route({
      url: "/auth/signup",
      method: "POST",
      status: 400,
      response: { errors: [215] },
    });
    cy.get("[data-testid=username]")
      .type("testuser")
      .get("[data-testid=email]")
      .type("testuser@gmail.com")
      .get("[data-testid=password]")
      .type("TestPassword2020!")
      .blur();
    cy.get("[data-testid=signup-btn]").click();
    cy.get("[data-testid=message-username]").contains(
      validationMessages.EXISTING_USER
    );
    cy.get("[data-testid=message-email]").contains(
      validationMessages.EXISTING_USER
    );
    cy.get("[data-testid=message-password]").should("not.be.visible");
    cy.get("[data-testid=signin]");
  });
});
