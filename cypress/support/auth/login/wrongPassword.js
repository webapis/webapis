import validationMessages from "../../../../client/features/authentication/validation/validationMessages";
Cypress.Commands.add("wrongPassword", ({ PORT }) => {
  cy.visit(`https://localhost:${PORT}`);
  cy.get("[data-testid=login-link]").click();
  cy.route({
    url: "/mock/auth/login",
    status: 400,
    response: { inputValErrorCodes: [212] },
    method: "POST",
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
