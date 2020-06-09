import {h} from 'preact'
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
import { Home } from './Home';
import {WSocketProvider} from '../wsocket/WSocketProvider'
import {HangoutsProvider} from '../hangouts/state/HangoutsProvider'
import {useAppContext,AppRoute} from '../app-context/app-context'
const Hangouts = lazy(() => import('../hangouts'));
const Group = lazy(() => import('../group/group'));
export function App(){
    const appContext=useAppContext()
    const {initialRoute}=appContext[0]
    return <AuthProvider>
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
          <AppRoute path='/auth'>
            <RouteProvider initialRoute='/login'>
              <Authentication />
            </RouteProvider>
          </AppRoute>

          <AppRoute path='/'>
            <Home />
          </AppRoute>

          <AppRoute path='/hangouts'>
            <Suspense fallback={<div>loading...</div>}>
              <Hangouts initialRoute={initialRoute}/>
            </Suspense>
          </AppRoute>
          <AppRoute path='/group'>
            <Suspense fallback={<div>loading...</div>}>
              <Group />
            </Suspense>
          </AppRoute>
          {''}
        </ThemeProvider>
      </FormProvider>
    </RootRouteProvider>
    </HangoutsProvider>
    </WSocketProvider>
  </AuthProvider>
}