import validationMessages from "../../../client/features/authentication/validation/validationMessages";

describe("5_Login_server_side_stubbed_validation_spec", () => {
  beforeEach(() => {
    cy.server();

    cy.visit("/");
    cy.get("[data-testid=login-link]").click();
    cy.task("seed:deleteCollection", {
      dbName: "auth",
      collectionName: "users",
    });
    Cypress.on("window:before:load", (win) => {
      win.jsDisabled = true;
    });
  });
  it("user submits: empty emailorusername or password (219) client JSDisabled", () => {
    //  cy.route({url:'/auth/login',status:400,response:{errors:[219]}})
    cy.get("[data-testid=login-btn]").click();
    cy.get("[data-testid=message-emailorusername]").contains(
      validationMessages.REQUIRED_FIELD
    );
    cy.get("[data-testid=message-password]").contains(
      validationMessages.REQUIRED_FIELD
    );
  });
  it("user submits: invalid emailorusername (218) client JSDisabled", () => {
    //  cy.route({url:'/auth/login',status:400,response:{errors:[218]}})
    cy.get("[data-testid=emailorusername]").type("1232/*sd$");
    cy.get("[data-testid=login-btn]").click();
    cy.get("[data-testid=message-emailorusername]").contains(
      validationMessages.INVALID_USERNAME_OR_EMAIL
    );
  });
  it("user submits :non existent usernameoremail (212)", () => {
    // cy.route({url:'/auth/login',status:400,response:{errors:[212]}})
    cy.get("[data-testid=emailorusername]").type("testuser");
    cy.get("[data-testid=password]").type("TestPassword!w");
    cy.get("[data-testid=login-btn]").click();
    cy.get("[data-testid=message-emailorusername]").contains(
      validationMessages.INVALID_CREDENTIALS
    );
    cy.get("[data-testid=message-password]").contains(
      validationMessages.INVALID_CREDENTIALS
    );
  });
  it("user submits: matching emailorusername and wrong password (212)", () => {
    // cy.route({url:'/auth/login',status:400,response:{errors:[212]}})
    cy.task("seed:user", {
      email: "testuserone@gmail.com",
      username: "testuser",
      password: "TestPassword!22s",
    });
    cy.get("[data-testid=emailorusername]").type("testuser");
    cy.get("[data-testid=password]").type("TestPassword!w");
    cy.get("[data-testid=login-btn]").click();
    cy.get("[data-testid=message-emailorusername]").contains(
      validationMessages.INVALID_CREDENTIALS
    );
    cy.get("[data-testid=message-password]").contains(
      validationMessages.INVALID_CREDENTIALS
    );
  });

  it.only("Succesful login: user submits: valid emailorusername and password SUBSEQUENT LOGIN", () => {
    cy.signup({ username: "testuser" });
    cy.signout();
    cy.login({ username: "testuser" });
    cy.get("[data-testid=message-emailorusername]").should("not.be.visible");
    cy.get("[data-testid=message-password]").should("not.be.visible");
    cy.get("[data-testid=socket-connection]").contains("online");
    cy.signout();
    cy.get("[data-testid=socket-connection]").contains("offline");
  }); //
});
