import "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js";
import { h, render } from "preact";
import htm from "htm.module";
//import {} from "../../components/app-route/index";
import AppNavigation from "./AppNavigation";
import RouteContainer from "./RouteContainer";
import { useAuth } from "../../features/authentication/state/useAuth";
const html = htm.bind(h);

export default function App() {
  const {
    onAuthNavigation,
    state: { user },
  } = useAuth();
  return html`<div>
    <${AppNavigation}
      user=${user}
      username=${user && user.username}
      onAuthNavigation=${onAuthNavigation}
    />
    <${RouteContainer} />
  </div>`;
}
