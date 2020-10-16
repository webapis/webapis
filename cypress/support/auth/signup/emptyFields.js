import validationMessages from "../../../../client/features/authentication/validation/validationMessages";
Cypress.Commands.add("emptyFieldsSignup", ({ PORT }) => {
  cy.visit(`https://localhost:${PORT}`);
  Cypress.on("window:before:load", (win) => {
    win.jsDisabled = true;
  });
  cy.route({
    url: "/mock/auth/signup",
    method: "post",
    status: 400,
    response: { inputValErrorCodes: [205, 207, 208] },
  });
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
