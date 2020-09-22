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

import "./auth/login/empyFields";
import "./auth/login/invalidEmailorusername";
import "./auth/login/nonexistentingUser";
import "./auth/login/wrongPassword";

import "./auth/signup/emptyFields";
import "./auth/signup/existingUser";
import "./auth/signup/invalidFields";
import "./auth/signup/takenEmail";
import "./auth/signup/takenUserName";

import "./hangout/invitation";
import "./hangout/block";
import "./hangout/unblock";
import "./hangout/decline";
import "./hangout/undecline";
import "./hangout/inviteasguest";
import "./websocket/index";
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
