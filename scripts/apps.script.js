const { crossEnv, series, concurrent } = require("nps-utils");
//ENV:
//-appName :client side: required for build time tobe able to move build files to specific app folder
//-appName :server side: required for server to be able server app from specific app folder
//-rtc:client side: required for build time for service adapters to adapt to rtc service chosen to use like websocket or firebase
//-auth:client side: required for build time for service adapters to adapt to auth service chosen to use like nodejs, firebase, parjse.js
//-env :client and server side: specfies prod, test, dev environment

//returns buildtime envs for rollup.js
function clientEnv({ appName, rtc, auth, env }) {
  return crossEnv(`appName=${appName} RTC=${rtc} AUTH=${auth} ENV=${env} `);
}
// returns rintime envs for nodejs
function serverEnv({ appName, env }) {
  return crossEnv(`appName=${appName} ENV=${env} `);
}

function serverCommands({ env }) {
  switch (env) {
    case "dev":
      return "nodemon server/index.js";
    case "prod":
      return "node server/index.js";
    default:
      return "nodemon server/index.js";
  }
}
function clientCommands({ env }) {
  switch (env) {
    case "dev":
      return "rollup -c -w";
    case "prod":
      return "rollup -c";
    default:
      return "rollup -c -w";
  }
}

function serverScript({ appName, env }) {
  return {
    description: "server script",
    script: `${serverEnv({ appName, env })} ${serverCommands({ env })}`,
  };
}

function clientScript({ appName, env, rtc, auth }) {
  return {
    description: "client script",
    script: `${clientEnv({ appName, rtc, auth, env })}${clientCommands({
      env,
    })}`,
  };
}

const apps = [
  {
    appName: "hangout-app",
    rtc: "WEBSOCKET",
    auth: "NODEJS",
    env: "DEV",
    scriptName: "hangoutdev",
  },
  {
    appName: "webcom-app",
    rtc: "WEBSOCKET",
    auth: "NODEJS",
    env: "DEV",
    scriptName: "webcomdev",
  },
  {
    appName: "websocket-app",
    rtc: "WEBSOCKET",
    auth: "NODEJS",
    env: "DEV",
    scriptName: "websocketdev",
  },
  {
    appName: "websocket-app",
    rtc: "WEBSOCKET",
    auth: "NODEJS",
    env: "DEV",
    scriptName: "websocketprod",
  },
];
const appScripts = apps.reduce((a, c, i) => {
  let accum = {};
  if (i === 0) {
    accum = {
      [`${c.scriptName}_client`]: clientScript({
        appName: c.appName,
        rtc: c.rtc,
        auth: c.auth,
        env: c.env,
      }),
      [`${c.scriptName}_server`]: serverScript({
        appName: c.appName,
        env: c.env,
      }),
      [`${c.scriptName}`]: concurrent.nps(
        `${c.scriptName}_client`,
        `${c.scriptName}_server`
      ),
    };
  } else {
    accum = {
      ...a,

      [`${c.scriptName}_client`]: clientScript({
        appName: c.appName,
        rtc: c.rtc,
        auth: c.auth,
        env: c.env,
      }),
      [`${c.scriptName}_server`]: serverScript({
        appName: c.appName,
        env: c.env,
      }),
      [`${c.scriptName}`]: concurrent.nps(
        `${c.scriptName}_client`,
        `${c.scriptName}_server`
      ),
    };
  }
  return accum;
}, {});

exports.appScripts = appScripts;
