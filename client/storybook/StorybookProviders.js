/* eslint-disable no-undef */
import { h } from 'preact';
import { AppRouteProvider } from '../app-route/AppRouteProvider';

import { ThemeProvider } from '../theme/theme-context';
import { NavProvider } from '../nav/NavProvider';


export default function AppProviders({ children }) {
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
          <NavProvider>
              {children}
       
          </NavProvider>
      </AppRouteProvider>
    </ThemeProvider>
  );
}
