import {
  h,
  render,
} from "https://cdnjs.cloudflare.com/ajax/libs/preact/10.4.6/preact.module.js";
import htm from "https://cdnjs.cloudflare.com/ajax/libs/htm/3.0.4/htm.module.js";

import StorybookRoutes from "./StorybookRoutes";
import Navbar, {
  NavBarNav,
  NavBarCollapse,
} from "../client/components/nav-bar/index";
import NavDropdown, {
  DropdownMenu,
  DropdownItem,
} from "../client/components/nav-bar/nav-dropdown";

import AppRouterProvider from "../client/components/app-route/index";
const html = htm.bind(h);

render(
  html`<${AppRouterProvider}
    title="Webcom"
    initState=${{ route: "/", featureRoute: "/hangouts", name: "storybook" }}
  >
    <${Navbar} brand="Storybook" bg="white">
      <${NavBarCollapse}>
        <${NavBarNav}>
          <${NavDropdown} title="Components">
            <${DropdownMenu}>
              <${DropdownItem} id="button">Buttons<//>
              <${DropdownItem} id="text-input">TextInput<//>
              <${DropdownItem} id="icons">Icons<//>
              <${DropdownItem} id="alert">Alert<//>
            <//>
          <//>
          <${NavDropdown} title="Authentication">
            <${DropdownMenu}>
              <${DropdownItem} id="login">Login<//>
              <${DropdownItem} id="signup">Signup<//>
              <${DropdownItem} id="change-password">Change Password<//>
              <${DropdownItem} id="forgot-password">Forgot Password<//>
            <//>
          <//>
          <${NavDropdown} title="Hangout">
            <${DropdownMenu}>
              <${DropdownItem} id="block">Block<//>
              <${DropdownItem} id="blocked">Blocked<//>
              <${DropdownItem} id="configure">Configure<//>
              <${DropdownItem} id="declined">Declined<//>
              <${DropdownItem} id="hangouts">Hangout<//>
              <${DropdownItem} id="invite">Invite<//>
              <${DropdownItem} id="invitee">Invitee<//>
              <${DropdownItem} id="inviter">Inviter<//>
              <${DropdownItem} id="unreadhangouts">UnreadHangouts<//>
              <${DropdownItem} id="hangchat">Hangchat<//>
              <${DropdownItem} id="guest">GuestHangchatUi<//>
              <${DropdownItem} id="navigation">Navigation<//>
              <${DropdownItem} id="videocall">VideoCall<//>
            <//>
          <//>
        <//>
      <//>
    <//>
    <${StorybookRoutes} />
  <//>`,
  document.body
);

/*
  <StorybookProviders>
    <Navbar brand="Storybook" bg="dark">
      <NavBarCollapse>
        <NavBarNav>
          <NavDropdown title="Components">
            <DropdownMenu>
              <DropdownItem id="button">Buttons</DropdownItem>
              <DropdownItem id="text-input">TextInput</DropdownItem>
              <DropdownItem id="icons">Icons</DropdownItem>
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
              <DropdownItem id="search">Hangout Search</DropdownItem>
              <DropdownItem id="filter">Hangout Filter</DropdownItem>
            </DropdownMenu>
          </NavDropdown>
        </NavBarNav>
      </NavBarCollapse>
    </Navbar>
    <StorybookRoutes />
  </StorybookProviders>
*/
/*

html` <${StorybookProviders}>
<${Navbar} brand="Storybook" bg="dark">
  <${NavBarCollapse}>
    <${NavBarNav}>
      <${NavDropdown} title="Components">
        <${DropdownMenu}>
          <${DropdownItem} id="button">Buttons<//>
          <${DropdownItem} id="text-input">TextInput<//>
          <${DropdownItem} id="icons">Icons<//>
          <${DropdownItem} id="alert">Alert<//>
        <//>
      <//>
      <${NavDropdown} title="Authentication">
        <${DropdownMenu}>
          <${DropdownItem} id="login">Login<//>
          <${DropdownItem} id="signup">Signup<//>
          <${DropdownItem} id="change-password">Change Password<//>
          <${DropdownItem} id="forgot-password">Forgot Password<//>
        <//>
      <//>
      <${NavDropdown} title="Hangout">
        <${DropdownMenu}>
          <${DropdownItem} id="block">Block<//>
          <${DropdownItem} id="blocked">Blocked<//>
          <${DropdownItem} id="configure">Configure<//>
          <${DropdownItem} id="hangchat">Hangchat<//>
          <${DropdownItem} id="hangout">Hangout<//>
          <${DropdownItem} id="invite">Invite<//>
          <${DropdownItem} id="invitee">Invitee<//>
          <${DropdownItem} id="inviter">Inviter<//>
          <${DropdownItem} id="unreadhangouts">UnreadHangouts<//>
          <${DropdownItem} id="search">Hangout Search<//>
          <${DropdownItem} id="filter">Hangout Filter<//>
        <//>
      <//>
    <//>
  <//>
<//>
<${StorybookRoutes} />
<//>
<//>
*/
