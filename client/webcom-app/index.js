import 'whatwg-fetch';
import { h, render } from 'preact';
import { Suspense, lazy } from 'preact/compat';
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
import { AppProvider } from '../app-context/app-context';
import { Home } from './Home';
import {WSocketProvider} from '../wsocket/WSocketProvider'
import {HangoutsProvider} from '../hangouts/state/HangoutsProvider'

const Hangouts = lazy(() => import('../hangouts'));
const Group = lazy(() => import('../group/group'));
render(
  <AppProvider title='Webcom'>
    <AuthProvider>
      <WSocketProvider url ="ws://localhost:3000/hangouts">
        <HangoutsProvider>
      <RootRouteProvider initialRoute='/'>
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

            <RootRoute path='/hangouts'>
              <Suspense fallback={<div>loading...</div>}>
                <Hangouts/>
              </Suspense>
            </RootRoute>
            <RootRoute path='/group'>
              <Suspense fallback={<div>loading...</div>}>
                <Group />
              </Suspense>
            </RootRoute>
            {''}
          </ThemeProvider>
        </FormProvider>
      </RootRouteProvider>
      </HangoutsProvider>
      </WSocketProvider>
    </AuthProvider>
  </AppProvider>,
  document.body
);
