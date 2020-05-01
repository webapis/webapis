import 'whatwg-fetch';
import { h, render } from 'preact';
import { RouteProvider, Route } from '../route/router';
import Navigation, { NavItem } from '../nav/Navigation';
import Authentication from '../auth/Authentication';
import { ThemeProvider } from '../theme/theme-context';
import { DrawerContent } from '../layout/DrawerContent';
import { AuthContent } from '../auth/AuthContent';
import { AuthProvider } from '../auth/auth-context';
import { FormProvider } from '../form/form-context';
import { OtherContent } from './OtherContent';
import { Home } from './Home';

render(
  <AuthProvider>
    <FormProvider>
      <ThemeProvider
        initState={{
          primary: {
            background: '#6200EE',
            color: '#ffffff',
            fontFamily: 'Roboto, Helvetica, "Arial"',
          },
        }}
      >
        <RouteProvider initialRoute='/'>
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
      </ThemeProvider>
    </FormProvider>
  </AuthProvider>,
  document.body
);
