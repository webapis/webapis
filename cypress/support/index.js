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
import "./auth/login/successfulLogin";

import "./auth/signup/emptyFields";
import "./auth/signup/existingUser";
import "./auth/signup/invalidFields";
import "./auth/signup/takenEmail";
import "./auth/signup/takenUserName";
import "./auth/signup/successfulSignUp";

import "./hangout/target-online/invitation";
import "./hangout/target-online/block";
import "./hangout/target-online/unblock";
import "./hangout/target-online/decline";
import "./hangout/target-online/undecline";
import "./hangout/target-online/inviteasguest";
import "./hangout/sender-offline/invitation";

import "./websocket/index";

import "./hangout/target-offline/Invitation";
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
