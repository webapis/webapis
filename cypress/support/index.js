// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "./loginByEmail";
import "./parse/signup";
import "./parse/createUser";
import "./parse/loginByEmail";
import "./parse/deleteUser";
import "./auth/login";
import "./auth/signup";
import "./auth/signout";
import "./hangout/invite";
import "./hangout/accept";
import "./hangout/decline";
import "./hangout/block";
Cypress.on("window:before:load", (win) => {
  delete win.fetch;
});

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  cy.log("application error..", JSON.stringify(err));
  cy.log("application error stack..", JSON.stringify(err.stack));
  return false;
});
// Alternatively you can use CommonJS syntax:
// require('./commands')
