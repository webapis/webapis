import validationMessages from "../../../../client/features/authentication/validation/validationMessages";
Cypress.Commands.add("invalidEmailOrUsername", ({ PORT }) => {
  cy.visit(`https://localhost:${PORT}`);
  cy.route({
    url: "/auth/login",
    status: 400,
    response: { inputValErrorCodes: [218] },
    method: "POST",
  });
  cy.get("[data-testid=emailorusername]").type("1232/*sd$");
  cy.get("[data-testid=login-btn]").click();
  cy.get("[data-testid=message-emailorusername]").contains(
    validationMessages.INVALID_USERNAME_OR_EMAIL
  );
});
