import 'whatwg-fetch';
import { h, render } from 'preact';
import { AppRouteProvider } from '../app-route/AppRouteProvider';
import { HangoutsProvider } from '../hangouts/state/HangoutsProvider';
import { AuthProvider } from '../auth/auth-context';
import { App } from './App'
render(
  <AppRouteProvider title='Webcom' initState={{ route: '/hangouts', featureRoute: '/hangouts' }}>
    <AuthProvider>
      <HangoutsProvider socketUrl={`wss://${ip}:3000/hangouts`}>
        <App />
      </HangoutsProvider>
    </AuthProvider>
  </AppRouteProvider>,
  document.body
);
