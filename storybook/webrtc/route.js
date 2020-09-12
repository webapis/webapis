import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { AppRoute, useAppRoute } from "../../client/components/app-route/index";

import VideoCallUiState from "./videocall.state.ui";

const html = htm.bind(h);
const hangouts = [
  { username: "userone" },
  { username: "usertwo" },
  { username: "userthree" },
];
function clientEnv({ appName, rtc, auth, env }) {
  return `appName=${appName} rtc=${rtc} auth=${auth} ENV=${env} `;
}
// returns rintime envs for nodejs
function serverEnv({ appName, env }) {
  return `appName=${appName} ENV=${env} `;
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
export default function WebRTCRoutes() {
  const [stream, setStream] = useState(null);
  const {
    routeState: { route },
  } = useAppRoute();
  useEffect(() => {
    const apps = [
      {
        appName: "webcom",
        rtc: "websocket",
        auth: "nodejs",
        env: "dev",
        scriptName: "webcomdev",
      },
      {
        appName: "websocket",
        rtc: "websocket",
        auth: "nodejs",
        env: "dev",
        scriptName: "websocketdev",
      },
    ];
    const reduced = apps.reduce((a, c, i) => {
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
          [`${c.scriptName}`]: 'npsUtils.concurrent.nps("lint", "test", "build")',
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
          [`${c.scriptName}`]: 'npsUtils.concurrent.nps("lint", "test", "build")',
        };
      }
      return accum;
    }, {});
    console.log("test reducer here", reduced);
  }, []);
  useEffect(() => {
    if (false) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((mediaStream) => {
          setStream(mediaStream);
        });
    }
  }, [route]);
  return [
    html`
      <${AppRoute} path="/videocall">
        <${VideoCallUiState} stream=${stream} />
      <//>
    `,
  ];
}
