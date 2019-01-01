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
  useEffect(() => {
    if (user) {
      setSocketUrl(
        `${RTC_URL}/?user=${JSON.stringify({
          ...user,
          browserId: "1234567890",
          browsers: [{ browserId: "1234567890" }],
        })}`
      );
    }
  }, [user]);
  return html`<${ServiceAdapter} user=${user} socketUrl=${socketUrl}>
    ${() => {
      return html`<div>
        <${NavigationContainer} user=${user} />
        <${RouteContainer} user=${user} />
      </div>`;
    }}
  <//>`;
}
