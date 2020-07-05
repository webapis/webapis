import { h, render } from 'preact';
import StorybookProviders from './StorybookProviders'
import StorybookRoutes from './StorybookRoutes'
import Navbar, { NavBarNav, NavItem, NavLink, NavBarCollapse } from 'components/nav-bar'
import NavDropdown, { DropdownMenu, DropdownItem } from 'components/nav-bar/nav-dropdown'

render(
  <StorybookProviders>
    <Navbar brand="Storybook" bg="dark">
      <NavBarCollapse>
        <NavBarNav>
          <NavDropdown title="Components">
            <DropdownMenu>
              <DropdownItem id="button">Buttons</DropdownItem>
              <DropdownItem id="text-input">TextInput</DropdownItem>
            </DropdownMenu>
          </NavDropdown>
          <NavDropdown title="Authentication">
            <DropdownMenu>
              <DropdownItem id="login">Login</DropdownItem>
              <DropdownItem id="signup">Signup</DropdownItem>
              <DropdownItem id="change-password">Change Password</DropdownItem>
              <DropdownItem id="forgot-password">Forgot Password</DropdownItem>
            </DropdownMenu>
          </NavDropdown>
        </NavBarNav>
      </NavBarCollapse>
    </Navbar>
    <StorybookRoutes />
  </StorybookProviders>

  ,
  document.body
);
