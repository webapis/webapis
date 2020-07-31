const { crossEnv, series, concurrent } = require("nps-utils");
function runApps({ back, env, appName }) {
  return concurrent({
    server: {
      script:
        crossEnv(app({ appName }) + backEnd({ back })) + serverEnv({ env }),
    },
    client: {
      script:
        crossEnv(app({ appName }) + backEnd({ back })) + clientEnv({ env }),
    },
  });
}

function serverEnv({ env }) {
  return env === "prod" ? "node server/index.js" : "nodemon server/index.js";
}

function clientEnv({ env }) {
  return env === "prod" ? "rollup -c" : "rollup -c -w";
}

function backEnd({ back }) {
  return back === "node"
    ? "PREACT_APP_BACK=PREACT_APP_NODEJS "
    : "PREACT_APP_BACK=PREACT_APP_PARSE ";
}

function app({ appName }) {
  return `appName=${appName} `;
}

function testFeature({ feature }) {
  return `cypress run --headless --record --key 8947ab69-a60d-465d-810e-c0184180764e  --spec cypress/integration/${feature}/**/*`;
}

function testFeatureLocally({ feature, browser }) {
  return `cypress run --headless --browser ${browser}  --spec cypress/integration/${feature}/**/*`;
}

module.exports = {
  scripts: {
    cyp: "npm run cypress open",
    preMerge: { script: series.nps("testAuth.node") },
    apps: {
      webcom: {
        node: {
          dev: {
            script: runApps({
              back: "node",
              env: "dev",
              appName: "webcom-app",
            }),
          },
          prod: {
            script: runApps({
              back: "node",
              env: "prod",
              appName: "webcom-app",
            }),
          },
        },
      },
    },
    test: { script: series.nps("cy.auth") },
    testLocal: { script: series.nps("cy.authLocal", "cy.hangoutsLocal") },
    // testHangouts: {
    //   script: concurrent({
    //     app: series.nps("apps.webcom.node.dev"),
    //     auth: series.nps("test.hangouts"),
    //   }),
    // },
    cy: {
      auth: { script: testFeature({ feature: "auth" }) },
      authLocal: {
        script: testFeatureLocally({ feature: "auth", browser: "chrome" }),
      },
      hangoutsLocal: { script: testFeatureLocally({ feature: "hangouts" }) },
      hangouts: { script: testFeature({ feature: "hangouts" }) },
      open: { script: "cypress open" },
    },
  },
};
// integrating cypress//
