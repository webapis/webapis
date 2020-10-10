import { h, createContext } from "preact";
import { useContext, useMemo, useReducer, useEffect } from "preact/hooks";
import htm from "htm.module";
import {
  useHangoutNav,
  useHangouts,
} from "../../features/hangouts/state/useHangouts";
import Navigation from "../../features/hangouts/ui-components/Navigation";
const html = htm.bind(h);
export default function NavigationContainer({ user }) {
  const { onNavigation } = useHangoutNav({ user });
  const {
    state: { unreadsCount, socketConnected },
  } = useHangouts({ user });
  return html`
    <${Navigation}
      socketConnected=${socketConnected}
      authed=${true}
      messageCounter=${unreadsCount}
      username=${user.username}
      onAuthNavigation=${() => {}}
      onHangoutNavigation=${onNavigation}
    />
  `;
}
