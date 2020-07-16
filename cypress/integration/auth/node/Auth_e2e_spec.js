describe("Authentication fitures", () => {
  beforeEach(() => {
    cy.task("seed:delete", {});
    cy.server();
    cy.visit("/");
    cy.wait(50);
    cy.register({
      username: "webapis",
      email: "webapis.github@gmail.com",
      password: "TestPassword2020_!",
    });
  });
  it("Authentication logic testing", () => {
    cy.route("POST", "/auth/signup").as("signup");
    cy.get("[data-testid=menu]").click();
    cy.get("[data-testid=signup]").click();
    cy.get("[data-testid=username]").type("testuser");
    cy.get("[data-testid=email]").type("testuser@gmail.com");
    cy.get("[data-testid=password]").type("TestPassword2020_!");
    cy.get("[data-testid=signup-btn]").click();

    cy.wait("@signup").should((xhr) => {
      expect(xhr.status).to.equal(200);
    });
    cy.get("[data-testid=home]");
    cy.wait(1000); //logut
    cy.get("[data-testid=menu]").click();
    cy.get("[data-testid=logout]").click();

    cy.wait(1000); //login
    cy.get("[data-testid=menu]").click();
    cy.get("[data-testid=login]").click();
    cy.get("[data-testid=emailOrUsername]")
      .type("testuser@gmail.com")
      .get("[data-testid=password]")
      .type("TestPassword2020_!")
      .get("[data-testid=login-btn]")
      .click();
    cy.get("[data-testid=home]");

    cy.wait(1000); //changepasssword
    cy.get("[data-testid=menu]").click();
    cy.get("[data-testid=changepassword]").click();
    cy.get("[data-testid=password]").type("Dragondlt!_23");
    cy.get("[data-testid=confirm]").type("Dragondlt!_23");
    cy.get("[data-testid=change-pass-btn]").click();
    cy.get("[data-testid =auth-feedback]");

    cy.wait(1000); //login with new password
    cy.get("[data-testid=menu]").click();
    cy.get("[data-testid=logout]").click();
    cy.wait(1000);
    cy.get("[data-testid=menu]").click();
    cy.get("[data-testid=login]").click();
    cy.get("[data-testid=emailOrUsername]")
      .type("testuser@gmail.com")
      .get("[data-testid=password]")
      .type("Dragondlt!_23")
      .get("[data-testid=login-btn]")
      .click();

    cy.wait(1000); //forgotpassword
    cy.get("[data-testid=menu]").click();
    cy.get("[data-testid=logout]").click();
    cy.wait(1000);
    cy.get("[data-testid=menu]").click();
    cy.get("[data-testid=login]").click();
    cy.get("[data-testid=forgotpassword]").click();
    cy.get("[data-testid=email]").type("webapis.github@gmail.com");
    cy.get("[data-testid=requestpasschange-btn]").click();
    cy.get("[data-testid =auth-feedback]");
  });
});
