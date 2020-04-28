// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('login', () => {
  cy.request({
    url: 'http://localhost:3000/seed/users',
    method: 'post',
    body: {
      username: 'demo',
      email: 'demo@gmail.com',
    },
  })
    .its('body')
    .then((body) => {
      cy.request({
        url: 'http://localhost:3000/auth/login',
        method: 'GET',
        headers: {
          'Conten-Type': 'application/json',
          'Access-Control-Allow-Headers': '*',
          Authorization: `Basic ${btoa(`${body.email}:${body.password}`)}`,
        },
      })
        .its('body')
        .then((body) => {
          const { email, username, token } = body;
          cy.window()
            .its('localStorage')
            .invoke(
              'setItem',
              username,
              JSON.stringify({ username, email, token })
            );
          debugger;
        });
    });
});
