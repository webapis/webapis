import validationMessages from "../../../../client/features/authentication/validation/validationMessages";
Cypress.Commands.add("emptyFields", ({ PORT }) => {
  cy.visit(`https://localhost:${PORT}`);
  cy.get("[data-testid=login-link]").click();
  cy.route({
    url: "/mock/auth/login",
    status: 400,
    response: { inputValErrorCodes: [219] },
    method: "post",
  });
  cy.get("[data-testid=login-btn]").click();
  cy.get("[data-testid=message-emailorusername]").contains(
    validationMessages.REQUIRED_FIELD
  );
});
