import "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js";
import {
  h,
  render,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import AppRouteProvider from "../../components/app-route/index";
import AuthProvider from "../../features/authentication/state/AuthProvider";
import AuthService from "../../service-adapters/auth-adapter/AuthService";
const html = htm.bind(h);

export default function AppProviders({ children }) {
  return html`<${AppRouteProvider}
    title="Hangout"
    initState=${{ appRoute: "/home", featureRoute: "/home" }}
  >
    <${AuthService}>
      ${({ user, signedout }) => {
        return children({ user, signedout });
      }}
    <//></${AppRouteProvider}
  >`;
}
