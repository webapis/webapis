import { h } from 'preact';
import { AppRouteProvider } from '../app-route/AppRouteProvider';
import { HangoutsProvider } from '../hangouts/state/HangoutsProvider';
import { AuthProvider } from '../auth/auth-context';
import { ThemeProvider } from '../theme/theme-context';
import { NavProvider } from '../nav/NavProvider';
import { App } from './App';
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
            <HangoutsProvider socketUrl={`wss://${ip}:3000/hangouts`}>
              {children}
            </HangoutsProvider>
          </NavProvider>
        </AuthProvider>
      </AppRouteProvider>
    </ThemeProvider>
  );
}
