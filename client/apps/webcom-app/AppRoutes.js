import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { AppRoute } from 'components/app-route/AppRouteProvider';
import { Home } from './Home';
import ParseAuthentication from 'features/authentication/ParseAuthentication';
import NodeAuthentication from 'features/authentication/NodeAuthentication';

const Hangouts = lazy(() => import('features/hangouts/ui-components/Hangout'));


export function AppRoutes() {
  return (
    <div style={{ height: '100%',backgroundColor:'yellow' }}>
      <AppRoute path="/auth">

          {PREACT_APP_BACK ==='PREACT_APP_PARSE' && <ParseAuthentication/>}
          {PREACT_APP_BACK ==='PREACT_APP_NODEJS' && <NodeAuthentication/>}
   
      </AppRoute>
      <AppRoute path="/">
        <Home />
      </AppRoute>

      <AppRoute path="/hangouts">
        <Suspense fallback={<div>loading...</div>}>
          <Hangouts />
        </Suspense>
      </AppRoute>
  
    </div>
  );
}
