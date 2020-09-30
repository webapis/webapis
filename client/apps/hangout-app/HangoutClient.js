import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useEffect,
  useState,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import NavigationContainer from "./NavigationContainer";
import RouteContainer from "./RouteContainer";
import ServiceAdapter from "../../service-adapters/ServiceAdapter";

const html = htm.bind(h);

export default function HangoutClient({ user }) {
  const [socketUrl, setSocketUrl] = useState(null);

  return html`<${ServiceAdapter} user=${user} socketUrl=${socketUrl}>
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
