import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import Navigation, { NavItem } from '../nav/Navigation';
import Authentication from '../auth/Authentication';
import { ThemeProvider } from '../theme/theme-context';
import { DrawerContent } from '../layout/DrawerContent';
import { AuthContent } from '../auth/AuthContent';
import { AuthProvider } from '../auth/auth-context';
import { FormProvider } from '../form/form-context';
import { OtherContent } from './OtherContent';
import { Home } from './Home';
import { HangoutsProvider } from '../hangouts/state/HangoutsProvider';
import { AppRoute } from '../app-route/AppRouteProvider';
const Hangouts = lazy(() => import('../hangouts'));
const Group = lazy(() => import('../group/group'));
export function App() {
  return (
    <div style={{height:'100vh'}}>
    <AuthProvider>
  
        <HangoutsProvider socketUrl="wss://10.100.36.114:3000/hangouts">
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
              <AppRoute path="/auth">
                <Authentication />
              </AppRoute>

              <AppRoute path="/">
                <Home />
              </AppRoute>

              <AppRoute path="/hangouts">
                <Suspense fallback={<div>loading...</div>}>
                  <Hangouts />
                </Suspense>
              </AppRoute>
              <AppRoute path="/group">
                <Suspense fallback={<div>loading...</div>}>
                  <Group />
                </Suspense>
              </AppRoute>
              {''}
            </ThemeProvider>
          </FormProvider>
        </HangoutsProvider>
  
    </AuthProvider>
    </div>
  );
}
