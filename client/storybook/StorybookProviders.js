/* eslint-disable no-undef */
import { h } from 'preact';
import  AppRouteProvider  from 'components/app-route';

import  ThemeProvider from 'components/theme/theme-context';



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
    
              {children}
       
         
      </AppRouteProvider>
    </ThemeProvider>
  );
}
