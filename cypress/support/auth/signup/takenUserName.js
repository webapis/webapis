import validationMessages from "../../../../client/features/authentication/validation/validationMessages";
Cypress.Commands.add("takenUserName", ({ PORT }) => {
  cy.visit(`https://localhost:${PORT}`);

  cy.get("[data-testid=signup-link]").click();
  cy.route({
    url: "/auth/signup",
    method: "post",
    status: 400,
    response: { inputValErrorCodes: [213] },
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
