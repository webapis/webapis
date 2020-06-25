/* eslint-disable no-undef */
import { h } from 'preact';
import { AppRouteProvider } from '../app-route/AppRouteProvider';
import { HangoutsProvider } from '../hangouts/state/HangoutsProvider';
import { AuthProvider } from '../auth/auth-context';
import { ThemeProvider } from '../theme/theme-context';
import { NavProvider } from '../nav/NavProvider';
import { ParseProvider } from '../hangouts/state/ParseProvider'
import { NodejsProvider } from '../hangouts/state/NodejsProvider'

export function AppProviders(props) {
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
            {PREACT_APP_BACK === 'PREACT_APP_PARSE' && <ParseProvider>
              <HangoutsProvider socketUrl={`wss://${ip}:3000/hangouts`} {...props} />
            </ParseProvider>}
            {PREACT_APP_BACK === 'PREACT_APP_NODEJS' &&
              <NodejsProvider>
                <HangoutsProvider socketUrl={`wss://${ip}:3000/hangouts`} {...props} />
              </NodejsProvider>
            }
          </NavProvider>
        </AuthProvider>
      </AppRouteProvider>
    </ThemeProvider>
  );
}
