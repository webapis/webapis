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
Cypress.Commands.add('login', ({ username, email, password }) => {
  cy.request({
    url: 'http://localhost:3000/seed/users',
    method: 'post',
    body: {
      username,
      email,
      password,
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
              'webcom',
              JSON.stringify({ username, email, token })
            );
        });
    });
});

Cypress.Commands.add('register', ({ username, email, password }) => {
  cy.request({
    url: 'http://localhost:3000/seed/users',
    method: 'post',
    body: {
      username,
      email,
      password,
    },
  });
});

Cypress.Commands.add('forgotpassword', ({ email }) => {
 return  cy.request({
    url: 'http://localhost:3000/seed/requestpasschange',
    method: 'post',
    body: {
      email,
    },
  })
});


Cypress.Commands.add(
  'signup',
  ({ username, password, email, click, client = false, type = true }) => {
    if (client && type) {
      cy.get('[data-testid=username]')
        .type(`${username}`)
        .blur()
        .get('[data-testid=email]')
        .type(`${email}`)
        .blur()
        .get('[data-testid=password]')
        .type(`${password}`)
        .blur();
      if (click) {
        cy.get('[data-testid=signup-btn]').click();
      }
    }
    if (!client && type) {
      cy.get('[data-testid=username]')
        .type(`${username}`)
        .get('[data-testid=email]')
        .type(`${email}`)
        .get('[data-testid=password]')
        .type(`${password}`);
      if (click) {
        cy.get('[data-testid=signup-btn]').click();
      }
    }

    if (!type) {
      if (click) {
        cy.get('[data-testid=signup-btn]').click();
      }
    }
  }
);
