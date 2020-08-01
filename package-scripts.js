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

function crossMap({ browsers, features, record }) {
  return browsers.reduce((acc, b) => {
    return { ...acc, ...browserMap({ features, browser: b }) };
  }, {});
}
function browserMap({ features, browser, record }) {
  const mapping = {
    browser: {
      [browser]: {
        ...features.reduce((a, f) => {
          return { ...a, [f]: { script: cyConf({ browser, feature: f }) } };
        }, {}),
      },
    },
  };

  return mapping;
}

function cyConf({ browser, record = false, feature }) {
  //ci cross
  if (record && browser) {
    return `cypress run --headless --record --key 8947ab69-a60d-465d-810e-c0184180764e --browser ${browser} --spec cypress/integration/${feature}/**/*`;
  }
  // local cross
  else if (!record && browser) {
    return `cypress run --headless --browser ${browser}  --spec cypress/integration/${feature}/**/*`;
  }
  // ci default
  else if (record && !browser) {
    return `cypress run --headless --record --key 8947ab69-a60d-465d-810e-c0184180764e  --spec cypress/integration/${feature}/**/*`;
  }
  //local default
  else if (!record && !browser) {
    return `cypress run --headless  --spec cypress/integration/${feature}/**/*`;
  }
}

function defaultBrowser({ features, record }) {
  return features.reduce((acc, f) => {
    const loc = { ...acc, [f]: { script: cyConf({ feature: f, record }) } };
    console.log("f", f);
    return loc;
  }, {});
}

module.exports = {
  scripts: {
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
    test: {
      local: {
        script: series.nps("cy.local.auth", "cy.local.hangouts"),
        cross: { script: series.nps("cy.local.cross") },
      },
      script: series.nps("cy.ci.auth"),
    },
    cy: {
      local: {
        // nps cy.local.auth
        ...defaultBrowser({ features: ["auth", "hangouts"] }),
        //nps cy.local.cross.browser.chrome.auth
        cross: crossMap({
          browsers: ["chrome"],
          features: ["auth", "hangouts"],
        }),
      },
      ci: {
        //nps cy.ci.auth
        ...defaultBrowser({ features: ["auth", "hangouts"], record: true }),
        //nps cy.ci.cross.browser.chrome.auth
        cross: crossMap({
          browsers: ["chrome"],
          features: ["auth", "hangouts"],
          record: true,
        }),
      },
      open: { script: "cypress open" },
    },
  },
};
