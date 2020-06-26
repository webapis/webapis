/* eslint-disable no-undef */
import { h } from 'preact';
import { AppRouteProvider } from '../app-route/AppRouteProvider';
import { HangoutAdapter } from '../hangouts/state/HangoutAdapter';
import {HangoutsProvider} from '../hangouts/state/HangoutsProvider'
import { AuthProvider } from '../auth/auth-context';
import { ThemeProvider } from '../theme/theme-context';
import { NavProvider } from '../nav/NavProvider';


export function AppProviders({ children }) {
  return (
    <ThemeProvider
      initState={{
        primary: {
          background: '#6200EE',
          color: '#ffffff',
          fontFamily: 'Roboto, Helvetica, "Arial"',
        },
      }}
    >
      <AppRouteProvider
        title="Webcom"
        initState={{ route: '/', featureRoute: '/hangouts' }}
      >
        <AuthProvider>
          <NavProvider>
            <HangoutsProvider>
            <HangoutAdapter socketUrl={`wss://${ip}:3000`}>
              {children}
            </HangoutAdapter>
            </HangoutsProvider>
        
          </NavProvider>
        </AuthProvider>
      </AppRouteProvider>
    </ThemeProvider>
  );
}
