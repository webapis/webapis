//import "https://localhost:3000/devtools.module.js";

import "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js";
import { h, render } from "preact";
import "preact/debug";
import htm from "htm.module";
//import { App } from "./App";
import AppRouteProvider from "../../components/app-route/index";
//import { RootProviders } from "./RootProviders";
import ServiceAdapter from "../../service-adapters/ServiceAdapter";
import AuthService from "../../service-adapters/ServiceAdapter";
import RtcMessageService from "../../service-adapters/rtc-msg-adapter/RtcMsgService";
import HangoutsService from "../../features/hangouts/state/HangoutsService";
import AppNavigation from "./AppNavigation";
import { AppRoutes } from "./AppRoutes";
//Parse.liveQueryServerURL = `https://${ip}:1337/parse`
//Parse.serverURL = 'https://parseapi.back4app.com/'
//Parse.liveQueryServerURL = `wss://webapis.back4app.io`//
const html = htm.bind(h);
render(
  html`<${AppRouteProvider}>
    <${AuthService}
      >${({ user }) => {
        return html`<${RtcMessageService}
          >${({ sendMessage, message, connectionState, setRtcUrl }) => {
            return html`<${HangoutsService}
              sendMessage=${sendMessage}
              message=${message}
              connectionState=${connectionState}
              user=${user}
            >
              <${AppNavigation} />
            <//>`;
          }}</${RtcMessageService}
        >`;
      }}<//
    >
  <//>`,

  document.body
);

/*
 html` <${ServiceAdapter}
    >${({ user, setRtcUrl, connectionState }) => {
      return html` <${App}
        connectionState=${connectionState}
        user=${user}
        setRtcUrl=${setRtcUrl}
      />`;
    }}
  <//>`,
*/
