import 'whatwg-fetch';
import { h, render } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { ContactsProvider } from '../contacts/contact-context';
import { RootRouteProvider, RootRoute } from '../route/root-router';
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

const PeerToPeer = lazy(() => import('../p2p/p2p'));
const Group = lazy(() => import('../group/group'));
render(
  <AuthProvider>
    <RootRouteProvider initialRoute='/'>
      <FormProvider>
        <ContactsProvider>
          <ThemeProvider
            initState={{
              primary: {
                background: '#6200EE',
                color: '#ffffff',
                fontFamily: 'Roboto, Helvetica, "Arial"',
              },
            }}
          >
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
            <RootRoute path='/auth'>
              <RouteProvider initialRoute='/login'>
                <Authentication />
              </RouteProvider>
            </RootRoute>
           
            <RootRoute path='/'>
              <Home />
            </RootRoute>

            <RootRoute path='/p2p'>
              <Suspense fallback={<div>loading...</div>}>
                <PeerToPeer />
              </Suspense>
            </RootRoute>
            <RootRoute path='/group'>
              <Suspense fallback={<div>loading...</div>}>
                <Group />
              </Suspense>
            </RootRoute>

            {''}
          </ThemeProvider>
        </ContactsProvider>
      </FormProvider>
    </RootRouteProvider>
  </AuthProvider>,
  document.body
);
