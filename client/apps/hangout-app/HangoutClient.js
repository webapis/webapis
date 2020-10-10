import { h, createContext } from "preact";
import { useEffect, useState } from "preact/hooks";
import htm from "htm.module";
import NavigationContainer from "./NavigationContainer";
import RouteContainer from "./RouteContainer";
import ServiceAdapter from "../../service-adapters/ServiceAdapter";

const html = htm.bind(h);

export default function HangoutClient({ user }) {
  const [socketUrl, setSocketUrl] = useState(null);

  return html`<${ServiceAdapter} staticUser=${user} socketUrl=${socketUrl}>
    ${({ setRtcUrl }) => {
      function connect() {
        setRtcUrl(
          `${RTC_URL}/?username=${user.username}&browserId=${user.browserId}`
        );
      }
      return html`<div>
        <button id="connect" disabled=${!user} class="btn" onClick=${connect}>
          Connect
        </button>
        <div>
          <${NavigationContainer} user=${user} />
          <${RouteContainer} user=${user} />
        </div>
      </div>`;
    }}
  <//>`;
}
