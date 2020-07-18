import { h } from "preact";
import Navbar, {
  NavBarNav,
  NavItem,
  NavLink,
  NavBarCollapse,
} from "components/nav-bar";
import Nav from "components/nav";
import { useUserName } from "features/authentication/state/useUserName";
import { useAuth } from "features/authentication";
import { useHangouts } from "features/hangouts";
import GearIcon from "icons/bootstrap/GearIcon";
import PersonPlusIcon from "icons/bootstrap/PersonPlusIcon";
import { FeatureRoute } from "components/app-route";
import { WifiStatus } from "components/browser-api/online-status";
export function AppNavigation() {
  const { username } = useUserName();
  const { onSignOut } = useAuth();
  const { state, onNavigation } = useHangouts();
  const { hangout, unreadhangouts } = state;
  return (
    <div>
      <Navbar brand="Webcom" bg="dark">
        <NavBarCollapse>
          <NavBarNav>
            <NavItem>
              {username && (
                <NavLink
                  id="filter"
                  appRoute="/hangouts"
                  data-testid="hangouts-link"
                >
                  Hangouts
                </NavLink>
              )}
            </NavItem>
          </NavBarNav>
          <Nav horizontalAlignment="justify-content-end">
            {username && (
              <button
                id="unread"
                appRoute="/unread"
                onClick={onNavigation}
                data-testid="unread-link"
                type="button"
                class="btn btn-dark"
              >
                messages{" "}
                <span class="badge badge-light" data-testid="message-count">
                  {unreadhangouts ? unreadhangouts.length : 0}
                </span>
              </button>
            )}
            {!username && (
              <NavItem>
                <NavLink id="login" appRoute="/auth" data-testid="login-link">
                  Sign in
                </NavLink>
              </NavItem>
            )}
            {!username && (
              <NavItem>
                <NavLink id="signup" appRoute="/auth" data-testid="signup-link">
                  Sign up
                </NavLink>
              </NavItem>
            )}
            <NavItem>
              {username && (
                <NavLink
                  id="profile"
                  appRoute="/auth"
                  data-testid="profile-link"
                >
                  Welcome, {username}
                </NavLink>
              )}
            </NavItem>
            <NavItem>
              {username && (
                <NavLink
                  id="profile"
                  appRoute="/auth"
                  data-testid="signout-link"
                  onClick={onSignOut}
                >
                  Sign out
                </NavLink>
              )}
            </NavItem>
            <NavItem>
              {hangout && (
                <button
                  className="btn"
                  data-testid="nav-config"
                  id="configure"
                  onClick={onNavigation}
                >
                  <GearIcon color="white" />
                </button>
              )}
            </NavItem>
            <NavItem>
              <FeatureRoute path="/filter">
                <button
                  className="btn"
                  data-testid="search-link"
                  id="search"
                  onClick={onNavigation}
                >
                  <PersonPlusIcon width="1.5em" height="1.5em" />
                </button>
              </FeatureRoute>
            </NavItem>
            <NavItem>
              <WifiStatus fill="white" />
            </NavItem>
          </Nav>
        </NavBarCollapse>
      </Navbar>
    </div>
  );
}
