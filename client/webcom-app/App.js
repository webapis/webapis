import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import Navigation, { NavItem } from '../nav/Navigation';
import Authentication from '../auth/Authentication';
import { ThemeProvider } from '../theme/theme-context';
import { DrawerContent } from '../layout/DrawerContent';
import { AuthContent } from '../auth/AuthContent';
import { FormProvider } from '../form/form-context';
import { HangoutDrawerContent } from '../hangouts/nav/HangoutDrawerContent';
import { Home } from './Home';
import { HangoutTopMenu } from '../hangouts/nav/HangoutTopMenu'
import { AppRoute } from '../app-route/AppRouteProvider';
import './app.css'
const Hangouts = lazy(() => import('../hangouts'));
const Group = lazy(() => import('../group/group'));
export function App() {
  return (
    <div style={{ height: '100vh' }}>

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
              otherContent={<HangoutDrawerContent />}
            />
          }
        >
       
          <NavItem style={{ flex: 5 }}>WEB COM</NavItem>
          <HangoutTopMenu />
        </Navigation>
        <AppRoute path="/auth">
          <FormProvider>
            <Authentication />
          </FormProvider>
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

    </div>
  );
}
