import validationMessages from "../../../../client/auth/validation/validationMessages";

describe("ChangePassword", () => {
  describe("STATE:User was logged in", () => {
    beforeEach(() => {
      cy.server();

      const username = "demo";
      const email = "demo@gmail.com";
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTU2ZGU2NTUyNmJhM2JkYzdjNDg4YSIsIm5hbWUiOiJ3ZWJhcGlzLmdpdGh1YkBnbWFpbC5jb20iLCJpYXQiOjE1ODY4NjQzNzksImV4cCI6MTYxODQyMTMwNX0.6ija-jjG0Uva5StvQnZucndLOiUigEoQnd88W_qbEBc";

      cy.window()
        .its("localStorage")
        .invoke(
          "setItem",
          "webcom",
          JSON.stringify({ username, email, token })
        );
      cy.wait(50);
      cy.visit("/");
      cy.get("[data-testid=menu]").click();

      cy.get("[data-testid=changepassword]").click();
    });
    it("invalid password client", () => {
      cy.get("[data-testid=password]")
        .type("Dra")
        .blur()
        .get("[data-testid=message-password]")
        .contains(validationMessages.INVALID_PASSWORD);
    });
    it("passwords do not match client", () => {
      cy.get("[data-testid=password]").type("Dragondlt!23");
      cy.get("[data-testid=confirm]")
        .type("Dragondlt!")
        .blur()
        .get("[data-testid=message-confirm]")
        .contains(validationMessages.PASSWORDS_DO_NOT_MATCH);
    });

    it("successful password change", () => {
      cy.route({
        method: "put",
        url: "/auth/changepass",
        status: 200,
        response: {
          username: "demo",
          email: "demo@gmail.com",
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOTU2ZGU2NTUyNmJhM2JkYzdjNDg4YSIsIm5hbWUiOiJ3ZWJhcGlzLmdpdGh1YkBnbWFpbC5jb20iLCJpYXQiOjE1ODY4NjQzNzksImV4cCI6MTYxODQyMTMwNX0.6ija-jjG0Uva5StvQnZucndLOiUigEoQnd88W_qbEBc",
        },
      }).as("chagepass");
      cy.get("[data-testid=password]").type("Dragondlt!23");
      cy.get("[data-testid=confirm]").type("Dragondlt!23");
      cy.get("[data-testid=change-pass-btn]").click();

      cy.wait("@chagepass").should((xhr) => {
        expect(xhr.status).to.equal(200);
      });
    });
  });
});
