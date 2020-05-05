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
import { ContactsProvider } from '../chat/contacts/contacts-context';
import { Home } from './Home';
const Contacts = lazy(() => import('../chat/contacts/Contacts'));
render(
  <AuthProvider>
    <ContactsProvider>
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
            <Route path='/contacts'>
              <Suspense fallback={<div>Loading...</div>}>
                <Contacts />
              </Suspense>
            </Route>
       
          </RouteProvider>{''}
        </ThemeProvider>
      </FormProvider>
    </ContactsProvider>
  </AuthProvider>,
  document.body
);
