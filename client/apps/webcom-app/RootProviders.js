/* eslint-disable no-undef */
import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import AppRouteProvider from "components/app-route/index";
//import HangoutAdapter from "features/hangouts/state/HangoutAdapter";
import HangoutsProvider from "features/hangouts/state/HangoutsProvider";
import AuthService from "../../service-adapters/auth-adapter/AuthService";

import RTCMsgService from "../../service-adapters/rtc-msg-adapter/RtcMsgService";
const html = htm.bind(h);
export function RootProviders(props) {
  const { children } = props;
  return html` <${AppRouteProvider}
    title="Webcom"
    initState=${{ route: "/auth", featureRoute: "/login" }}
  >
    <${AuthService}
      ...${props}
      authedRoute=${{ route: "/hangouts", featureRoute: "/hangout" }}
    >
      <${RTCMsgService} ...${props}
        >${({ message, connectionState, sendMessage }) => {
          return html`<${HangoutsProvider}
            ...${props}
            message=${message}
            sendMessage=${sendMessage}
            connectionState=${connectionState}
          />`;
        }}<//
      >
    <//>
  <//>`;
}

/*
import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import AppRouteProvider from "components/app-route/index";
import HangoutAdapter from "features/hangouts/state/HangoutAdapter";
import HangoutsProvider from "features/hangouts/state/HangoutsProvider";
import WebRTCProvider from "features/webrtc/WebRTCProvider";
import AuthProvider from "features/authentication/index";
const html = htm.bind(h);
export function RootProviders({ children }) {
  return html`
    <${AppRouteProvider}
      title="Webcom"
      initState=${{ route: "/auth", featureRoute: "/login" }}
    >
      <${AuthProvider}
        authedRoute=${{ route: "/hangouts", featureRoute: "/hangout" }}
      >
        <${WebRTCProvider}>
          <${HangoutsProvider}>
            <${HangoutAdapter}
              socketUrl=${location.origin.replace(/^http/, "ws")}
            >
              ${children}
            <//>
          <//>
        <//>
      <//>
    <//>
  `;
}
*/

/*
<${RTCMsgService}
      >${({ sendMessage, message, connectionState }) => {
        return html` <${HangoutsProvider}...${props}
          sendMessage=${sendMessage}
          message=${message}
          connectionState=${connectionState}
        />`;
      }}
    <//>
*/
