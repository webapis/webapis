/* eslint-disable no-undef */
import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import AppRouteProvider from "components/app-route/index";
import HangoutAdapter from "features/hangouts/state/HangoutAdapter";
import HangoutsProvider from "features/hangouts/state/HangoutsProvider";
import AuthProvider from "features/authentication/index";
const html = htm.bind(h);
export function RootProviders({ children }) {
  return html`
    <${AppRouteProvider}
      title="Webcom"
      initState=${{ route: "/auth", featureRoute: "/" }}
    >
      <${AuthProvider}>
        <${HangoutsProvider}>
          <${HangoutAdapter} socketUrl=${`wss://${ip}:${PORT}`}>
            ${children}
          <//>
        <//>
      <//>
    <//>
  `;
}
