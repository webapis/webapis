import {
  h,
  createContext,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import {
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from "https://cdn.jsdelivr.net/gh/webapis/webapis@cdn/assets/libs/prod/hooks.cdn.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import { useHangoutNav } from "../../features/hangouts/state/useHangouts";
import Navigation from "../../features/hangouts/ui-components/Navigation";
const html = htm.bind(h);
export default function NavigationContainer({ user, messageCounter }) {
  const { onNavigation } = useHangoutNav({ user });
  return html`
    <${Navigation}
      socketConnected=${true}
      authed=${true}
      messageCounter=${messageCounter}
      username=${user.username}
      onAuthNavigation=${() => {}}
      onHangoutNavigation=${onNavigation}
    />
  `;
}
