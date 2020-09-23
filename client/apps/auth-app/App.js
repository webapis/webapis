import "https://cdn.jsdelivr.net/npm/whatwg-fetch@3.2.0/fetch.js";
import {
  h,
  render,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
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
