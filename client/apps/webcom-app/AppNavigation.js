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
import PeopleIcon from "icons/bootstrap/PeopleIcon";
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
      <${Navbar} brand="Webcom" bg="dark">
        <${NavBarCollapse}>
          <${NavBarNav}>
            <!-- NavItem -->
            <${NavItem}>
              ${user &&
              featureRoute !== "/filter" &&
              featureRoute !== "/search" &&
              html`
                <${NavLink}
                  id="filter"
                  appRoute="/hangouts"
                  data-testid="hangouts-link"
                >
                  Hangouts
                <//>
              `}
            <//>
            <${NavItem}>
              <button
                disabled=${!user || featureRoute === "/search"}
                class="btn"
                data-testid="search-link"
                id="search"
                onClick=${onPersonPlusClick}
              >
                <${PersonPlusIcon} width="1.5em" height="1.5em" />
              </button>
            <//>
            <${NavItem}>
              <button
                disabled=${!user || featureRoute === "/filter"}
                class="btn"
                data-testid="filter-link"
                id="search"
                onClick=${onPersonPlusClick}
              >
                <${PeopleIcon} width="2em" height="2em" color="white" />
              </button>
            <//>
          <//>
          <!-- NavBarNav -->
          <${Nav} horizontalAlignment="justify-content-end">
            ${user &&
            user.username &&
            html`
              <button
                id="unread"
                appRoute="/unread"
                onClick=${onNavigation}
                data-testid="unread-link"
                type="button"
                class="btn btn-dark"
              >
                messages:
                <span class="badge badge-light" data-testid="message-count">
                  ${" "}${unreadsCount}
                </span>
              </button>
            `}
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
