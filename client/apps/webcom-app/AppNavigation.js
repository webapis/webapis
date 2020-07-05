import { h } from 'preact';
import Navbar, { NavBarNav, NavItem, NavLink, NavBarCollapse } from 'components/nav-bar'
import Nav from 'components/nav'
import NavDropdown, { DropdownMenu, DropdownItem } from 'components/nav-bar/nav-dropdown'

export function AppNavigation() {
  return <div >
    <Navbar brand="Webcom" bg="dark">
      <NavBarCollapse>
        <NavBarNav>
          <NavItem>
            <NavLink id="hangout" appRoute="/hangouts">Hangouts</NavLink>
          </NavItem>

        </NavBarNav>
        <Nav horizontalAlignment="justify-content-end">
          <NavItem>
            <NavLink id="login" appRoute="/auth">Sign in</NavLink>
          </NavItem>
          <NavItem>
            <NavLink id="signup" appRoute="/auth" data-testid="signup-link">Sign up</NavLink>
          </NavItem>
       
        </Nav>
      </NavBarCollapse>
    </Navbar>
  </div>
}