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
import PersonPlusIcon from "icons/bootstrap/PersonPlusIcon";

import { actionTypes } from "../../features/hangouts/state/actionTypes";
const html = htm.bind(h);
export function AppNavigation() {
  const { routeState } = useAppRoute();

  const { featureRoute } = routeState;
  const { onSignOut, onAuthNavigation, state: authState } = useAuth();
  const { user } = authState;

  const { state, onNavigation, dispatch } = useHangouts();
  const { hangout, socketConnected, hangouts, unreadsCount, error } = state;

  function onPersonPlusClick(e) {
    onNavigation(e);
    dispatch({ type: actionTypes.HANGOUTS_UPDATED, hangouts: [] });
  }

  return html`
    <div>
      <${Navbar} brand="Webcom" bg="white">
        <${NavBarCollapse}>
          <${NavBarNav}>
            <!-- NavItem -->
            <${NavItem}>
              ${user &&
              featureRoute !== "/hangout" &&
              html`
                <${NavLink}
                  id="filter"
                  appRoute="/hangouts"
                  data-testid="hangouts-link"
                >
                  <${PeopleIcon} />
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
                messages:
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

export function PeopleIcon() {
  return html`
    <svg
      width="1.5em"
      height="1.5em"
      viewBox="0 0 16 16"
      class="bi bi-people-fill"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"
      />
    </svg>
  `;
}
