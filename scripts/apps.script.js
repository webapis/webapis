const { hgws, hgwsmb, ws, hgmock, webcom } = require("./apps_config.js");
const { crossEnv, series, concurrent, copy } = require("nps-utils");
//ENV:
//-appName :client side: required for build time tobe able to move build files to specific app folder
//-appName :server side: required for server to be able server app from specific app folder
//-rtc:client side: required for build time for service adapters to adapt to rtc service chosen to use like websocket or firebase
//-auth:client side: required for build time for service adapters to adapt to auth service chosen to use like nodejs, firebase, parjse.js
//-env :client and server side: specfies prod, test, dev environment

//returns buildtime envs for rollup.js
function clientEnv({
  appName,
  outputAppName,
  rtc,
  rtcUrl,
  auth,
  env,
  port,
  hangouts,
}) {
  return crossEnv(
    `appName=${appName} outputAppName=${outputAppName} HANGOUTS=${hangouts} RTC=${rtc} RTC_URL=${rtcUrl} AUTH=${auth}  NODE_ENV=${env} PORT=${port} `
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
    case "production":
      return "node --inspect=9229 server/index.js";
    default:
      return "nodemon server/index.js";
  }
}
function clientCommands({ env }) {
  switch (env) {
    case "dev":
      return "rollup -c -w ";
    case "production":
      return "rollup -c ";
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

function copyLibsScript({ outputAppName, assets }) {
  return {
    description: "copy client libraries",
    script: copy(`${assets} builds/${outputAppName}/build/libs`),
  };
}

function buildLibsScript({ port, outputAppName }) {
  return {
    description: "build libs",
    script: crossEnv(
      `outputAppName=${outputAppName} PORT=${port} rollup -c rollup.libs.config.js`
    ),
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
  hangouts,
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
      hangouts,
    })}${clientCommands({
      env,
    })}`,
  };
}
let assets =
  "node_modules/preact/devtools/dist/devtools.umd.js.map node_modules/preact/devtools/dist/devtools.umd.js node_modules/preact/debug/dist/debug.umd.js.map node_modules/preact/debug/dist/debug.umd.js node_modules/preact/dist/preact.module.js node_modules/preact/dist/preact.module.js.map node_modules/htm/dist/htm.module.js node_modules/jquery/dist/jquery.slim.min.js node_modules/jquery/dist/jquery.slim.min.map client/features/app-monitor/client-error.js node_modules/bootstrap/dist/js/bootstrap.min.js node_modules/bootstrap/dist/js/bootstrap.min.js.map node_modules/bootstrap/dist/css/bootstrap.min.css node_modules/bootstrap/dist/css/bootstrap.min.css.map node_modules/bootstrap/dist/js/bootstrap.js node_modules/bootstrap/dist/js/bootstrap.js.map node_modules/bootstrap/dist/css/bootstrap.css node_modules/bootstrap/dist/css/bootstrap.css.map node_modules/whatwg-fetch/dist/fetch.umd.js";

const hangoutTestApps = [
  {
    assets,

    appName: "websocket-app",
    outputAppName: "ws-app",
    rtc: "WEBSOCKET",
    auth: "NONE",
    hangouts: "NONE",
    env: "dev",
    port: 3002,
    scriptName: "ws-dev",
    rtcUrl: ws.rtcUrl({ PORT: 3002 }),
  },
  {
    assets,
    dest: "builds/hg-ws-app/build/libs",
    appName: "hangout-app",
    outputAppName: "hg-ws-app",
    rtc: "WEBSOCKET",
    auth: "NONE",
    hangouts: "INCLUDE",
    env: "dev",
    port: 3004,
    scriptName: "hg-ws-dev",
    rtcUrl: hgws.rtcUrl({ PORT: 3004 }),
  },
  {
    assets,
    dest: "builds/hgmock-app/build/libs",
    appName: "hangout-app",
    outputAppName: "hgmock-app",
    rtc: "MOCK",
    auth: "NONE",
    hangouts: "INCLUDE",
    env: "dev",
    port: 3005,
    scriptName: "hg-mock-dev",
    rtcUrl: hgmock.rtcUrl({ PORT: 3005 }),
  },
  {
    assets,
    dest: "builds/hg-ws-mg-app/build/libs",
    appName: "hangout-app",
    outputAppName: "hg-ws-mg-app",
    rtc: "WEBSOCKET",
    auth: "NONE",
    hangouts: "INCLUDE",
    env: "dev",
    port: 3006,
    scriptName: "hg-ws-mg-dev",
    rtcUrl: hgwsmb.rtcUrl({ PORT: 3006 }),
  },
  {
    assets,
    dest: "../builds/ws-app/build/libs --cwd=scripts",
    appName: "webcom-app",
    outputAppName: "webcom-app",
    rtc: "WEBSOCKET",
    auth: "NODEJS",
    hangouts: "INCLUDE",
    env: "dev",
    port: 3007,
    scriptName: "webcom-dev",
    rtcUrl: hgwsmb.rtcUrl({ PORT: 3007 }),
  },
  {
    assets,
    dest: "builds/auth-mock-app/build/libs",
    appName: "auth-app",
    outputAppName: "auth-mock-app",
    rtc: "NONE",
    auth: "MOCK",
    hangouts: "NONE",
    env: "dev",
    port: 3008,
    scriptName: "auth-mock-dev",
    rtcUrl: "NONE",
  },
  {
    assets,
    dest: "builds/auth-nodejs-app/build/libs",
    appName: "auth-app",
    outputAppName: "auth-nodejs-app",
    rtc: "NONE",
    auth: "NODEJS",
    hangouts: "NONE",
    env: "dev",
    port: 3009,
    scriptName: "auth-nodejs-dev",
    rtcUrl: "NONE",
  },
  {
    assets,
    dest: "builds/webcom-app/build/libs",
    appName: "webcom-app",
    outputAppName: "webcom-app",
    rtc: "WEBSOCKET",
    auth: "NODEJS",
    hangouts: "INCLUDE",
    env: process.env.NODE_ENV || "dev",
    port: process.env.PORT || 3010,
    scriptName: "webcom-prod",
    rtcUrl: webcom.rtcUrl({ PORT: process.env.PORT || 3010 }),
  },

  {
    assets,
    dest: "builds/webcomponent-auth-app/build/libs",
    appName: "webcomponent-auth-app",
    outputAppName: "webcomponent-auth-app",
    rtc: "WEBSOCKET",
    auth: "NODEJS",
    hangouts: "INCLUDE",
    env: process.env.NODE_ENV || "dev",
    port: process.env.PORT || 3011,
    scriptName: "webcomponent-auth-dev",
    rtcUrl: webcom.rtcUrl({ PORT: process.env.PORT || 3011 }),
  },
  {
    assets,
    dest: "builds/webcom-app/build/libs",
    appName: "webcomponent-app",
    outputAppName: "webcomponent-app",
    rtc: "NONE",
    auth: "NONE",
    hangouts: "NONE",
    env: process.env.NODE_ENV || "dev",
    port: process.env.PORT || 3012,
    scriptName: "webcomponent-dev",
    rtcUrl: webcom.rtcUrl({ PORT: process.env.PORT || 3012 }),
  },
];
const apps = [...hangoutTestApps];
const appScripts = apps.reduce((a, c, i) => {
  let accum = {};
  if (i === 0) {
    accum = {
      [`${c.scriptName}_buildLibs`]: buildLibsScript({
        outputAppName: c.outputAppName,
        port: c.port,
      }),
      [`${c.scriptName}_copyLibs`]: copyLibsScript({
        outputAppName: c.outputAppName,
        assets: c.assets,
      }),
      [`${c.scriptName}_client`]: clientScript({
        appName: c.appName,
        outputAppName: c.outputAppName,
        rtc: c.rtc,
        auth: c.auth,
        env: c.env,
        port: c.port,
        rtcUrl: c.rtcUrl,
        hangouts: c.hangouts,
        libs: c.libs,
        dest: c.dest,
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
      [`${c.scriptName}_buildLibs`]: buildLibsScript({
        outputAppName: c.outputAppName,
        port: c.port,
      }),
      [`${c.scriptName}_copyLibs`]: copyLibsScript({
        outputAppName: c.outputAppName,
        assets: c.assets,
      }),
      [`${c.scriptName}_client`]: clientScript({
        appName: c.appName,
        outputAppName: c.outputAppName,
        rtc: c.rtc,
        auth: c.auth,
        env: c.env,
        port: c.port,
        rtcUrl: c.rtcUrl,
        hangouts: c.hangouts,
        libs: c.libs,
        dest: c.dest,
      }),
      [`${c.scriptName}_server`]: serverScript({
        appName: c.outputAppName,
        env: c.env,
        port: c.port,
      }),
      [`${c.scriptName}`]: concurrent.nps(
        `${c.scriptName}_buildLibs`,
        `${c.scriptName}_copyLibs`,
        `${c.scriptName}_client`,
        `${c.scriptName}_server`
      ),
    };
  }
  return accum;
}, {});

exports.appScripts = appScripts;
