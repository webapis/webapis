import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

import { useAppRoute } from "components/app-route/index";
import { useAuth } from "features/authentication/index";
import { useHangouts } from "features/hangouts/index";
import GearIcon from "icons/bootstrap/GearIcon";
import Navigation from "./Navigation";
import { actionTypes } from "../../features/hangouts/state/actionTypes";
const html = htm.bind(h);
export function AppNavigation() {
  const { routeState } = useAppRoute();

  const { featureRoute } = routeState;
  const { onSignOut, onAuthNavigation, state: authState } = useAuth();
  const { user } = authState;

  const { state, funcs } = useHangouts();
  const {
    hangout,
    socketConnected,
    hangouts,
    unreadsCount,
    error,
    dispatch,
  } = state;
  const { onNavigation } = funcs;

  return html`
    <${Navigation}
      socketConnected=${socketConnected}
      authed=${user ? true : false}
      messageCounter=${unreadsCount}
      username=${hangout && hangout.username}
      name=${user && user.username}
      onAuthNavigation=${onAuthNavigation}
      onHangoutNavigation=${onNavigation}
    />
  `;
}
