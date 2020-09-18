const { crossEnv, series, concurrent } = require("nps-utils");
//ENV:
//-appName :client side: required for build time tobe able to move build files to specific app folder
//-appName :server side: required for server to be able server app from specific app folder
//-rtc:client side: required for build time for service adapters to adapt to rtc service chosen to use like websocket or firebase
//-auth:client side: required for build time for service adapters to adapt to auth service chosen to use like nodejs, firebase, parjse.js
//-env :client and server side: specfies prod, test, dev environment

//returns buildtime envs for rollup.js
function clientEnv({ appName, rtc, auth, env, port }) {
  return crossEnv(
    `appName=${appName} RTC=${rtc} AUTH=${auth} ENV=${env} PORT=${port} `
  );
}
// returns rintime envs for nodejs
function serverEnv({ appName, env, port }) {
  return crossEnv(`appName=${appName} ENV=${env} PORT=${port} `);
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
      throw "No env specified for client command";
    //return "rollup -c rollup.config.dev.libs.js && rollup -c -w";
  }
}

function serverScript({ appName, env, port }) {
  return {
    description: "server script",
    script: `${serverEnv({ appName, env, port })} ${serverCommands({ env })}`,
  };
}

function clientScript({ appName, env, rtc, auth, port }) {
  return {
    description: "client script",
    script: `${clientEnv({ appName, rtc, auth, env, port })}${clientCommands({
      env,
    })}`,
  };
}

const apps = [
  {
    appName: "hangout-app",
    rtc: "WEBSOCKET",
    auth: "NODEJS",
    env: "dev",
    port: 3005,
    scriptName: "hangoutdev",
  },
  {
    appName: "webcom-app",
    rtc: "WEBSOCKET",
    auth: "NODEJS",
    env: "dev",
    port: 3001,
    scriptName: "webcomdev",
  },
  {
    appName: "websocket-app",
    rtc: "WEBSOCKET",
    auth: "NODEJS",
    env: "dev",
    port: 3002,
    scriptName: "websocketdev",
  },
  {
    appName: "websocket-app",
    rtc: "WEBSOCKET",
    auth: "NODEJS",
    env: "dev",
    port: 3003,
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
        port: c.port,
      }),
      [`${c.scriptName}_server`]: serverScript({
        appName: c.appName,
        env: c.env,
        port: c.port,
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
        port: c.port,
      }),
      [`${c.scriptName}_server`]: serverScript({
        appName: c.appName,
        env: c.env,
        port: c.port,
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
