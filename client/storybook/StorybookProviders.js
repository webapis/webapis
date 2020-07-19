/* eslint-disable no-undef */
import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import AppRouteProvider from "components/app-route";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

const html = htm.bind(h);
export default function AppProviders({ children }) {
  return html`
    <${AppRouteProvider}
      title="Webcom"
      initState=${{ route: "/", featureRoute: "/hangouts", name: "storybook" }}
    >
      ${children}
    <//>
  `;
}
