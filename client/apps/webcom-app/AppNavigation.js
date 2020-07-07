import { h } from 'preact';
import Navbar, { NavBarNav, NavItem, NavLink, NavBarCollapse } from 'components/nav-bar'
import Nav from 'components/nav'
import { useUserName } from 'features/authentication/state/useUserName'
import { useAuth } from 'features/authentication'
import NavDropdown, { DropdownMenu, DropdownItem } from 'components/nav-bar/nav-dropdown'

export function AppNavigation() {
  const { username } = useUserName()
  const { onSignOut } = useAuth()
  return <div >
    <Navbar brand="Webcom" bg="dark">
      <NavBarCollapse>
        <NavBarNav>
          <NavItem>
            {username && <NavLink id="hangout" appRoute="/hangouts">Hangouts</NavLink>}
          </NavItem>
        </NavBarNav>
        <Nav horizontalAlignment="justify-content-end">
          {!username && <NavItem>
            <NavLink id="login" appRoute="/auth" data-testid="login-link">Sign in</NavLink>
          </NavItem>}
          {!username && <NavItem>
            <NavLink id="signup" appRoute="/auth" data-testid="signup-link">Sign up</NavLink>
          </NavItem>}
          <NavItem>
            {username && <NavLink id="profile" appRoute="/auth" data-testid="profile-link">Welcome, {username}</NavLink>}
          </NavItem>
          <NavItem>
            {username && <NavLink id="profile" appRoute="/auth" data-testid="signout-link" onClick={onSignOut}>Sign out</NavLink>}
          </NavItem>
        </Nav>
      </NavBarCollapse>
    </Navbar>
  </div>
}