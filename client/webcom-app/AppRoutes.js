import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { AppRoute } from '../app-route/AppRouteProvider';
import { Home } from './Home';
import ParseAuthentication from '../auth/ParseAuthentication';
import NodeAuthentication from '../auth/NodeAuthentication';
import { FormProvider } from '../form/form-context';
const Hangouts = lazy(() => import('../hangouts'));
const Group = lazy(() => import('../group/group'));

export function AppRoutes() {
  return (
    <div style={{ height: '100%' }}>
      <AppRoute path="/auth">
        <FormProvider>
          {PREACT_APP_BACK ==='PREACT_APP_PARSE' && <ParseAuthentication/>}
          {PREACT_APP_BACK ==='PREACT_APP_NODEJS' && <NodeAuthentication/>}
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
    </div>
  );
}
