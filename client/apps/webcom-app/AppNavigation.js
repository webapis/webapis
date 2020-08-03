import { h } from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";
import Navbar, {
  NavBarNav,
  NavItem,
  NavLink,
  NavBarCollapse,
} from "components/nav-bar/index";
import Nav from "components/nav/index";
import { useUserName } from "features/authentication/state/useUserName";
import { useAuth } from "features/authentication/index";
import { useHangouts } from "features/hangouts/index";
import GearIcon from "icons/bootstrap/GearIcon";
import PersonPlusIcon from "icons/bootstrap/PersonPlusIcon";
import { FeatureRoute } from "components/app-route/index";
import { WifiStatus } from "components/browser-api/online-status/index";
const html = htm.bind(h);
export function AppNavigation() {
  const { username } = useUserName();
  const { onSignOut, onAuthNavigation } = useAuth();
  const { state, onNavigation } = useHangouts();
  const { hangout, unreadhangouts, readyState, error } = state;
  return html`
    <div>
      <${Navbar} brand="Webcom" bg="dark">
        <${NavBarCollapse}>
          <${NavBarNav}>
            <${NavItem}>
              ${username &&
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
            <!-- NavItem -->
          <//>
          <!-- NavBarNav -->
          <${Nav} horizontalAlignment="justify-content-end">
            ${username &&
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
                  ${" "}${unreadhangouts ? unreadhangouts.length : 0}
                </span>
              </button>
            `}
            ${!username &&
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
            ${!username &&
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
              ${username &&
              html`
                <${NavLink}
                  id="profile"
                  appRoute="/auth"
                  data-testid="profile-link"
                >
                  Welcome, ${username}
                <//>
              `}
            <//>
            <${NavItem}>
              ${username &&
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
              <${FeatureRoute} path="/filter">
                <button
                  class="btn"
                  data-testid="search-link"
                  id="search"
                  onClick=${onNavigation}
                >
                  <${PersonPlusIcon} width="1.5em" height="1.5em" />
                </button>
              <//>
            <//>
            <${NavItem}>
              <${NavLink}
                id="monitor"
                appRoute="/monitor"
                data-testid="monitor-link"
              >
                monitor
              <//>
            <//>
            <${NavItem}>
              <${NavLink} id="monitor" data-testid="socket-connection">
                ${readyState === 1 ? "connected" : "disconnected"}
                ${error && error.message}
              <//>
            <//>
            <${NavItem}>
              <${WifiStatus} fill="white" />
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
