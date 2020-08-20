import validationMessages from "../../../client/features/authentication/validation/validationMessages";

describe("3_Signup_server_side_e2e_validation_spec", () => {
  beforeEach(() => {
    cy.server();
    cy.window()
      .its("localStorage")
      .invoke("setItem", "browserId", JSON.stringify("1234567890"));
    cy.visit("/");
    cy.get("[data-testid=signup-link]").click();
    cy.task("seed:deleteCollection", {
      dbName: "auth",
      collectionName: "users",
    });
    Cypress.on("window:before:load", (win) => {
      win.jsDisabled = true;
    });
  });

  it("client side JS disabled: user submmits empty fields", () => {
    //cy.task('seed:user',({email:'testuser'}))
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
    cy.get("[data-testid=username]")
      .type("1122")
      .get("[data-testid=email]")
      .type("testusergmail.com")
      .get("[data-testid=password]")
      .type("Te!")
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
    cy.task("seed:user", {
      email: "testuserone@gmail.com",
      username: "testuser",
      password: "TestPassword!22s",
    });
    cy.get("[data-testid=username]")
      .type("testuser")
      .get("[data-testid=email]")
      .type("testuser@gmail.com")
      .get("[data-testid=password]")
      .type("TestPassword!22s")
      .blur();
    cy.get("[data-testid=signup-btn]").click();
    cy.get("[data-testid=message-username]").contains(
      validationMessages.USERNAME_TAKEN
    );
    cy.get("[data-testid=message-email]").should("not.be.visible");
    cy.get("[data-testid=message-password]").should("not.be.visible");
  });
  it("user enters taken email", () => {
    cy.task("seed:user", {
      email: "testuser@gmail.com",
      username: "testuserone",
      password: "TestPassword!22s",
    });
    cy.get("[data-testid=username]")
      .type("testuser")
      .get("[data-testid=email]")
      .type("testuser@gmail.com")
      .get("[data-testid=password]")
      .type("TestPassword!22s")
      .blur();
    cy.get("[data-testid=signup-btn]").click();
    cy.get("[data-testid=message-username]").should("not.be.visible");
    cy.get("[data-testid=message-email]").contains(
      validationMessages.REGISTERED_EMAIL
    );
    cy.get("[data-testid=message-password]").should("not.be.visible");
  });
  it("user enters taken email and username", () => {
    cy.task("seed:user", {
      email: "testuser@gmail.com",
      username: "testuser",
      password: "TestPassword!22s",
    });
    cy.get("[data-testid=username]")
      .type("testuser")
      .get("[data-testid=email]")
      .type("testuser@gmail.com")
      .get("[data-testid=password]")
      .type("TestPassword!22s")
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
  it("Succeful signup", () => {
    cy.server();
    cy.route({
      url: "/auth/signup",
      method: "POST",
    }).as("successSignUp");
    cy.get("[data-testid=username]")
      .type("testuser")
      .get("[data-testid=email]")
      .type("testuser@gmail.com")
      .get("[data-testid=password]")
      .type("TestPassword!22s")
      .blur();
    cy.get("[data-testid=signup-btn]").click();
    cy.get("[data-testid=message-username]").should("not.to.be.visible");
    cy.get("[data-testid=message-email]").should("not.to.be.visible");
    cy.get("[data-testid=message-password]").should("not.to.be.visible");
    cy.wait("@successSignUp").its("requestBody").should("deep.equal", {
      password: "TestPassword!22s",
      email: "testuser@gmail.com",
      username: "testuser",
      browserId: "1234567890",
    });

    assert.isNotNull(
      cy.window().its("localStorage").invoke("getItem", "testuser-browserId"),
      "is not null"
    );
    cy.signout();
  });
});
