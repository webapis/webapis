/* eslint-disable no-undef */
import { h } from 'preact';
import { AppRouteProvider } from '../../components/app-route/AppRouteProvider';
import  HangoutAdapter  from 'features/hangouts/state/HangoutAdapter';
import {HangoutsProvider} from 'features/hangouts/state/HangoutsProvider'
import { AuthProvider } from 'features/authentication/state/auth-context';
import  ThemeProvider  from '../../components/theme/theme-context';
import  NavigationProvider  from '../../components/controls/navigation/NavigationProvider';


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
          <NavigationProvider>
            <HangoutsProvider>
            <HangoutAdapter socketUrl={`wss://${ip}:3000`}>
              {children}
            </HangoutAdapter>
            </HangoutsProvider>
        
          </NavigationProvider>
        </AuthProvider>
      </AppRouteProvider>
    </ThemeProvider>
  );
}
