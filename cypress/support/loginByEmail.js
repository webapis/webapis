import { saveBrowserIdToLocalStorage } from "../../client/features/authentication/state/onBrowserId";
Cypress.Commands.add(
  "loginByEmail",
  ({ email, password, hasBrowserId = false }) => {
    cy.log("email and password", email, password);
    cy.request({
      url: "https://localhost:3000/auth/login",
      method: "POST",
      headers: {
        "Conten-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        Authorization: `Basic ${btoa(`${email}:${password}`)}`,
      },
      body: JSON.stringify({ hasBrowserId }),
      failOnStatusCode: false,
    })
      .its("body")
      .then((body) => {
        const { email, username, token, browserId } = body;
        if (browserId) {
          saveBrowserIdToLocalStorage({ username, browserId });
        }

        cy.window()
          .its("localStorage")
          .invoke(
            "setItem",
            "webcom",
            JSON.stringify({ username, email, token })
          );
      });
  }
);
