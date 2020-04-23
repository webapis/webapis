import { h, render } from 'preact';
import { RouteProvider, Link } from '../route/router';
import Navigation, { NavItem } from '../nav/Navigation';
import Authentication from '../auth/Authentication';
import { ThemeProvider } from '../theme/theme-context';

render(
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
          <Link to='/login'>LOGIN</Link>
        </NavItem>
        <NavItem>
          <Link to='/signup'>SIGNUP</Link>
        </NavItem>
      </Navigation>
      <Authentication />
    </RouteProvider>{' '}
  </ThemeProvider>,
  document.body
);

