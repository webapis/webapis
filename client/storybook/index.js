import { h, render } from "preact";
import StorybookProviders from "./StorybookProviders";
import StorybookRoutes from "./StorybookRoutes";
import Navbar, {
  NavBarNav,
  NavItem,
  NavLink,
  NavBarCollapse,
} from "components/nav-bar";
import NavDropdown, {
  DropdownMenu,
  DropdownItem,
} from "components/nav-bar/nav-dropdown";

render(
  <StorybookProviders>
    <Navbar brand="Storybook" bg="dark">
      <NavBarCollapse>
        <NavBarNav>
          <NavDropdown title="Components">
            <DropdownMenu>
              <DropdownItem id="button">Buttons</DropdownItem>
              <DropdownItem id="text-input">TextInput</DropdownItem>
              <DropdownItem id="toast">Toast</DropdownItem>
              <DropdownItem id="alert">Alert</DropdownItem>
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
          <NavDropdown title="Hangout">
            <DropdownMenu>
              <DropdownItem id="block">Block</DropdownItem>
              <DropdownItem id="blocked">Blocked</DropdownItem>
              <DropdownItem id="configure">Configure</DropdownItem>
              <DropdownItem id="hangchat">Hangchat</DropdownItem>
              <DropdownItem id="hangout">Hangout</DropdownItem>
              <DropdownItem id="invite">Invite</DropdownItem>
              <DropdownItem id="invitee">Invitee</DropdownItem>
              <DropdownItem id="inviter">Inviter</DropdownItem>
              <DropdownItem id="unreadhangouts">UnreadHangouts</DropdownItem>
            </DropdownMenu>
          </NavDropdown>
        </NavBarNav>
      </NavBarCollapse>
    </Navbar>
    <StorybookRoutes />
  </StorybookProviders>,

  document.body
);
