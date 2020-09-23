import validationMessages from "../../../../client/features/authentication/validation/validationMessages";
Cypress.Commands.add("invalidFields", ({ PORT }) => {
  cy.visit(`https://localhost:${PORT}`);
  Cypress.on("window:before:load", (win) => {
    win.jsDisabled = true;
  });

  cy.get("[data-testid=signup-link]").click();
  cy.route({
    url: "/mock/auth/signup",
    method: "post",
    status: 400,
    response: { inputValErrorCodes: [210, 211, 209] },
  });

  cy.get("[data-testid=username]")
    .type("123")
    .blur()
    .get("[data-testid=email]")
    .type("testemail.com")
    .blur()
    .get("[data-testid=password]")
    .type("123")
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
