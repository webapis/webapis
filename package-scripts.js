const { crossEnv, series, concurrent } = require("nps-utils");
const { storybook } = require("./scripts/storybook.script");
const { appScripts } = require("./scripts/apps.script");

function crossMap({ browsers, features, record, type }) {
  //nps cy.local.cross.browser.chrome.hangouts
  //nps cy.ci.cross.browser.chrome.auth
  let defaultCross = browsers.reduce((acc, b) => {
    const st = features.map((f) => {
      return `cy.${type}.cross.browser.${b}.${f}`;
    });

    return st;
  }, []);

  return {
    script: series.nps(...defaultCross),
    ...browsers.reduce((acc, b) => {
      return { ...acc, ...browserMap({ features, browser: b, record }) };
    }, {}),
  };
}
function browserMap({ features, browser, record }) {
  const mapping = {
    browser: {
      [browser]: {
        ...features.reduce((a, f) => {
          return {
            ...a,
            [f]: { script: cyConf({ browser, feature: f, record }) },
          };
        }, {}),
      },
    },
  };

  return mapping;
}

function cyConf({ browser, record = false, feature }) {
  //ci cross
  if (record && browser) {
    return `cypress run --headless --record --key 8947ab69-a60d-465d-810e-c0184180764e --parallel --group ${browser}/${feature}  --browser ${browser} --spec cypress/integration/${feature}/**/*`;
  }
  // local cross
  else if (!record && browser) {
    return `cypress run --headless --browser ${browser}  --spec cypress/integration/${feature}/**/*`;
  }
  // ci default
  else if (record && !browser) {
    return `cypress run --headless --record --key 8947ab69-a60d-465d-810e-c0184180764e --parallel --group ${feature} --spec cypress/integration/${feature}/**/*`;
  }
  //local default
  else if (!record && !browser) {
    return `cypress run --headless  --spec cypress/integration/${feature}/**/*`;
  }
}

function defaultBrowser({ features, record, type }) {
  const defaultFeatures = features.map((f) => {
    return `cy.${type}.${f}`;
  });
  return {
    script: series.nps(...defaultFeatures),
    ...features.reduce((acc, f) => {
      const loc = { ...acc, [f]: { script: cyConf({ feature: f, record }) } };

      return loc;
    }, {}),
  };
}

module.exports = {
  scripts: {
    hgdev: concurrent.nps("hg-mock-dev"),
    ...appScripts,
    storybook,
    testAva: {
      script: "ava -w",
    },
    test: {
      local: {
        script: series.nps("cy.local"),
        cross: { script: series.nps("cy.local.cross") },
      },
      script: series.nps("cy.ci"), //?
    },
    cy: {
      local: {
        // default nps cy.local :  nps cy.local.auth && nps cy.local.hangouts
        // nps cy.local.auth
        ...defaultBrowser({ features: ["auth", "hangouts"], type: "local" }),
        // nps cy.local.cross series
        //nps cy.local.cross.browser.chrome.auth
        cross: crossMap({
          browsers: ["chrome", "firefox"],
          features: ["auth", "hangouts"],
          type: "local",
        }),
      },
      ci: {
        //default nps cy.ci :   nps cy.ci.auth && nps cy.ci.hangouts
        //nps cy.ci.auth
        ...defaultBrowser({
          features: ["auth", "hangouts"],
          record: true,
          type: "ci",
        }),
        //nps cy.ci.cross.browser.chrome.auth
        // nps cy.ci.cross  series
        cross: crossMap({
          browsers: ["chrome", "firefox"],
          features: ["auth", "hangouts"],
          record: true,
          type: "ci",
        }),
      },
      open: { script: "cypress open" },
    },
  },
};
