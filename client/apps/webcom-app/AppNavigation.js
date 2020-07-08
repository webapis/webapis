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

export function AppNavigation() {
  const { username } = useUserName();
  const { onSignOut } = useAuth();
  const { state, onNavigation } = useHangouts();
  const { hangout } = state;
  return (
    <div>
      <Navbar brand="Webcom" bg="dark">
        <NavBarCollapse>
          <NavBarNav>
            <NavItem>
              {username && (
                <NavLink
                  id="hangout"
                  appRoute="/hangouts"
                  data-testid="hangouts"
                >
                  Hangouts
                </NavLink>
              )}
            </NavItem>
          </NavBarNav>
          <Nav horizontalAlignment="justify-content-end">
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
          </Nav>
        </NavBarCollapse>
      </Navbar>
    </div>
  );
}
