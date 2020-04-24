import 'whatwg-fetch';
import { h, render } from 'preact';
import { RouteProvider, Link } from '../route/router';
import Navigation, { NavItem } from '../nav/Navigation';
import Authentication from '../auth/Authentication';
import { ThemeProvider } from '../theme/theme-context';
import { AppProvider } from '../app-context';
render(
  <AppProvider>
    <ThemeProvider
      initState={{
        primary: {
          background: '#6200EE',
          color: '#ffffff',
          fontFamily: 'Roboto, Helvetica, "Arial"',
        },
      }}
    >
      <RouteProvider>
        <Navigation>
          <NavItem>
            <Link id='login' to='/login'>
              LOGIN
            </Link>
          </NavItem>
          <NavItem>
            <Link id='signup' to='/signup'>
              SIGNUP
            </Link>
          </NavItem>
          <NavItem>
            <Link id='forgotpassword' to='/forgotpassword'>
              FORGOT PASSWORD
            </Link>
          </NavItem>
          <NavItem>
            <Link id='changepassword' to='/changepassword'>
              CHANGE PASSWORD
            </Link>
          </NavItem>
        </Navigation>
        <Authentication />
      </RouteProvider>{' '}
    </ThemeProvider>{' '}
  </AppProvider>,
  document.body
);
