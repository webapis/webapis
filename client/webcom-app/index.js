import 'whatwg-fetch';
import { h, render } from 'preact';
import { RouteProvider, Route } from '../route/router';
import Navigation, { NavItem } from '../nav/Navigation';
import Authentication from '../auth/Authentication';
import { ThemeProvider } from '../theme/theme-context';
import { AppProvider } from '../app-context';
import { DrawerContent } from '../layout/DrawerContent';
import { AuthContent } from '../auth/AuthContent';
import { OtherContent } from './OtherContent';
import { Home } from './Home';

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
        <Navigation
          drawerContent={
            <DrawerContent
              authContent={<AuthContent />}
              otherContent={<OtherContent />}
            />
          }
        >
          <NavItem>WEB COM</NavItem>
    
        </Navigation>
        <Authentication />
        <Route path='/'>
          <Home />
        </Route>
      </RouteProvider>{' '}
    </ThemeProvider>{' '}
  </AppProvider>,
  document.body
);
