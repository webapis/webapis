import 'whatwg-fetch';
import { h, render } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { RouteProvider, Route } from '../route/router';
import Navigation, { NavItem } from '../nav/Navigation';
import Authentication from '../auth/Authentication';
import { ThemeProvider } from '../theme/theme-context';
import { DrawerContent } from '../layout/DrawerContent';
import { AuthContent } from '../auth/AuthContent';
import { AuthProvider } from '../auth/auth-context';
import { FormProvider } from '../form/form-context';
import { OtherContent } from './OtherContent';
import { ContactsProvider } from '../contacts/contact-context';
import { Home } from './Home';
import Invitation from '../invitation/Invitation';
import Messaging from '../messaging/Messaging';
import { PeerToPeerMobileContext } from '../p2p/p2p-mobile-context';
import { P2PDesktopProvider } from '../p2p/p2p-desktop-context';
const Contacts = lazy(() => import('../contacts/Contacts'));
const PeerToPeer = lazy(() => import('../p2p/p2p'));
const PeerToPeerChat = lazy(() => import('../p2p/p2p-chat'));
render(
  <AuthProvider>
    <RouteProvider initialRoute='/'>
      <FormProvider>
        <ContactsProvider>
          <PeerToPeerMobileContext>
            <P2PDesktopProvider>
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
                <Authentication />
                <Route path='/'>
                  <Home />
                </Route>
                <Route path='/contacts'>
                  <Suspense fallback={<div>loading...</div>}>
                    <Contacts />
                  </Suspense>
                </Route>

                <Route path='/invitation'>
                  <Suspense fallback={<div>loading...</div>}>
                    <Invitation />
                  </Suspense>
                </Route>
                <Route path='/messaging'>
                  <Suspense fallback={<div>loading...</div>}>
                    <Messaging />
                  </Suspense>
                </Route>
                <Route path='/p2p'>
                  <Suspense fallback={<div>loading...</div>}>
                    <PeerToPeer />
                  </Suspense>
                </Route>
                <Route path='/p2p-chat'>
                  <Suspense fallback={<div>loading...</div>}>
                    <PeerToPeerChat />
                  </Suspense>
                </Route>
                {''}
              </ThemeProvider>
            </P2PDesktopProvider>
          </PeerToPeerMobileContext>
        </ContactsProvider>
      </FormProvider>
    </RouteProvider>
  </AuthProvider>,
  document.body
);
