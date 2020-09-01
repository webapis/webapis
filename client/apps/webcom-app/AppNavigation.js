import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Navbar, {
  NavBarNav,
  NavItem,
  NavLink,
  NavBarCollapse,
} from "components/nav-bar/index";
import Nav from "components/nav/index";
import { useAppRoute } from "components/app-route/index";
import { useAuth } from "features/authentication/index";
import { useHangouts } from "features/hangouts/index";
import GearIcon from "icons/bootstrap/GearIcon";

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
  function onPersonPlusClick(e) {
    onNavigation(e);
    dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: [] });
  }

  return html`
    <div>
      <${Navbar} brand="Webcom">
        <${NavBarCollapse}>
          <${NavBarNav}>
            <!-- NavItem -->
            <${NavItem}>
              ${user &&
              featureRoute !== "/hangout" &&
              html`
                <${NavLink}
                  id="hangout"
                  appRoute="/hangouts"
                  data-testid="hangouts-link"
                >
                  <${PeopleIcon} id="hangout" />
                <//>
              `}
            <//>
          <//>
          <!-- NavBarNav -->
          <${Nav} horizontalAlignment="justify-content-end">
            ${user &&
            user.username &&
            html` <${NavItem}>
              <${NavLink}
                href="#"
                id="unread"
                appRoute="/unread"
                onClick=${onNavigation}
                data-testid="unread-link"
              >
                <${Envelope} />
                <span class="badge badge-light" data-testid="message-count">
                  ${" "}${unreadsCount}
                </span>
              <//>
            <//>`}
            ${!user &&
            html`
              <${NavItem}>
                <${NavLink}
                  id="login"
                  appRoute="/auth"
                  data-testid="login-link"
                  onClick=${onAuthNavigation}
                >
                  Sign in
                <//><//
              >
            `}
            ${!user &&
            html`
              <${NavItem}>
                <${NavLink}
                  id="signup"
                  appRoute="/auth"
                  data-testid="signup-link"
                  onClick=${onAuthNavigation}
                >
                  Sign up
                <//><//
              >
            `}
            <${NavItem}>
              ${user &&
              html`
                <${NavLink}
                  id="profile"
                  appRoute="/auth"
                  data-testid="profile-link"
                >
                  Welcome, ${user && user.username}
                <//>
              `}
            <//>
            <${NavItem}>
              ${user &&
              html`
                <${NavLink}
                  id="profile"
                  appRoute="/auth"
                  data-testid="signout-link"
                  onClick=${onSignOut}
                >
                  Sign out
                <//>
              `}
            <//>
            <${NavItem}>
              ${hangout &&
              html`
                <button
                  class="btn"
                  data-testid="nav-config"
                  id="configure"
                  onClick=${onNavigation}
                >
                  <${GearIcon} color="white" />
                </button>
              `}
            <//>

            <${NavItem}>
              <${NavLink} id="monitor" data-testid="socket-connection">
                ${socketConnected
                  ? html`<span class="badge badge-success">online</span>`
                  : html`<span class="badge badge-danger">offline</span>`}
                ${error && error.message}
              <//>
            <//>
          <//>
          <!-- Nav -->
        <//>
        <!-- NavBarCollapse -->
      <//>
      <!-- Navbar -->
    </div>
  `;
}

export function PeopleIcon(props) {
  return html`
    <svg
      ...${props}
      width="1.5em"
      height="1.5em"
      viewBox="0 0 16 16"
      class="bi bi-people-fill"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        ...${props}
        fill-rule="evenodd"
        d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
      />
    </svg>
  `;
}

function Envelope() {
  return html`
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      class="bi bi-envelope-fill"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555zM0 4.697v7.104l5.803-3.558L0 4.697zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757zm3.436-.586L16 11.801V4.697l-5.803 3.546z"
      />
    </svg>
  `;
}
