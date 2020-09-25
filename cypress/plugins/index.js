/* eslint-disable no-undef */
const seedLogin = require("./seedLogin");
const seedDelete = require("./seedDelete");
const seedUser = require("./seedUser");
const seedHangouts = require("./seedHangouts");
const deleteCollection = require("./deleteCollection");
const seedOnInvite = require("./seedOnInvite");
const seedOnAccept = require("./seedOnAccept");
const dropDatabase = require("./dropDatabase");
const queryMongoDb = require("./hangout/queryMongoDb");
//const onHangoutSeed = require("./hangout/onHangoutSeed");
///
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on("task", {
    "query:mongodb": ({ username }) => {
      return queryMongoDb({ username });
    },
    "seed:login": ({ email, username, password }) => {
      return seedLogin({ email, username, password });
    },
    "seed:user": ({ email, username, password }) => {
      return seedUser({ email, username, password });
    },
    "seed:delete": () => {
      return seedDelete();
    },
    "seed:hangouts": () => {
      return seedHangouts();
    },
    "seed:deleteCollection": ({ dbName, collectionName }) => {
      return deleteCollection({ dbName, collectionName });
    },
    "seed:onInvite": () => {
      return seedOnInvite();
    },
    "seed:onAccept": () => {
      return seedOnAccept();
    },
    "seed:dropDatabase": ({ dbName }) => {
      return dropDatabase({ dbName });
    },
    // "seed:onHangout": ({
    //   collectionName,
    //   dbName,
    //   hangout,
    //   senderUsername,
    //   senderEmail,
    // }) => {
    //   return onHangoutSeed({
    //     collectionName,
    //     dbName,
    //     hangout,
    //     senderUsername,
    //     senderEmail,
    //   });
    // },
  });
};
