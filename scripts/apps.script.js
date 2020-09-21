const { hgws, hgwsmb, ws, hgmock } = require("./apps_config.js");
const { crossEnv, series, concurrent } = require("nps-utils");
//ENV:
//-appName :client side: required for build time tobe able to move build files to specific app folder
//-appName :server side: required for server to be able server app from specific app folder
//-rtc:client side: required for build time for service adapters to adapt to rtc service chosen to use like websocket or firebase
//-auth:client side: required for build time for service adapters to adapt to auth service chosen to use like nodejs, firebase, parjse.js
//-env :client and server side: specfies prod, test, dev environment

//returns buildtime envs for rollup.js
function clientEnv({ appName, outputAppName, rtc, rtcUrl, auth, env, port }) {
  return crossEnv(
    `appName=${appName} outputAppName=${outputAppName} RTC=${rtc} RTC_URL=${rtcUrl} AUTH=${auth} NODE_ENV=${env} PORT=${port} `
  );
}
// returns rintime envs for nodejs
function serverEnv({ appName, env, port }) {
  return crossEnv(`appName=${appName} NODE_ENV=${env} PORT=${port} `);
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

function clientScript({
  appName,
  outputAppName,
  env,
  rtc,
  rtcUrl,
  auth,
  port,
}) {
  return {
    description: "client script",
    script: `${clientEnv({
      appName,
      outputAppName,
      rtc,
      auth,
      env,
      port,
      rtcUrl,
    })}${clientCommands({
      env,
    })}`,
  };
}
const hangoutTestApps = [
  {
    appName: "websocket-app",
    outputAppName: "ws-app",
    rtc: "WEBSOCKET",
    auth: "NODEJS",
    env: "dev",
    port: 3002,
    scriptName: "ws-dev",
    rtcUrl: ws.rtcUrl({ PORT: 3002 }),
  },
  {
    appName: "hangout-app",
    outputAppName: "hg-ws-app",
    rtc: "WEBSOCKET",
    auth: "NODEJS",
    env: "dev",
    port: 3004,
    scriptName: "hg-ws-dev",
    rtcUrl: hgws.rtcUrl({ PORT: 3004 }),
  },
  {
    appName: "hangout-app",
    outputAppName: "hgmock-app",
    rtc: "MOCK",
    auth: "NODEJS",
    env: "dev",
    port: 3005,
    scriptName: "hg-mock-dev",
    rtcUrl: hgmock.rtcUrl({ PORT: 3005 }),
  },
  {
    appName: "hangout-app",
    outputAppName: "hg-ws-mg-app",
    rtc: "WEBSOCKET",
    auth: "NODEJS",
    env: "dev",
    port: 3006,
    scriptName: "hg-ws-mg-dev",
    rtcUrl: hgwsmb.rtcUrl({ PORT: 3006 }),
  },
  {
    appName: "webcom-app",
    outputAppName: "webcom-app",
    rtc: "WEBSOCKET",
    auth: "NODEJS",
    env: "dev",
    port: 3007,
    scriptName: "webcom-dev",
    rtcUrl: hgwsmb.rtcUrl({ PORT: 3007 }),
  },
  {
    appName: "auth-app",
    outputAppName: "auth-app",
    rtc: "NONE",
    auth: "NODEJS",
    env: "dev",
    port: 3008,
    scriptName: "auth-dev",
    rtcUrl: "NONE",
  },
];
const apps = [...hangoutTestApps];
const appScripts = apps.reduce((a, c, i) => {
  let accum = {};
  if (i === 0) {
    accum = {
      [`${c.scriptName}_client`]: clientScript({
        appName: c.appName,
        outputAppName: c.outputAppName,
        rtc: c.rtc,
        auth: c.auth,
        env: c.env,
        port: c.port,
        rtcUrl: c.rtcUrl,
      }),
      [`${c.scriptName}_server`]: serverScript({
        appName: c.outputAppName,
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
        outputAppName: c.outputAppName,
        rtc: c.rtc,
        auth: c.auth,
        env: c.env,
        port: c.port,
        rtcUrl: c.rtcUrl,
      }),
      [`${c.scriptName}_server`]: serverScript({
        appName: c.outputAppName,
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
