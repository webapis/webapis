import 'whatwg-fetch';
import { h, render } from 'preact';
import ChangePassword from '../ChangePassword';
import { AppProvider } from '../../app-context';
import { RouteProvider, Route } from '../../route/router';
import { ThemeProvider } from '../../theme/theme-context';
import AuthFeedback, { LoginLink } from '../AuthFeedback';
render(
  <div>
    <AppProvider>
      <ThemeProvider
        initState={{
          primary: {
            background: '#6200EE',
            color: '#ffffff',
            fontFamily: 'Roboto, Helvetica, "Arial"',
          },
        }}
      >
        <RouteProvider initialRoute='/'>
          <Route path='/'>
            <ChangePassword />
          </Route>
          <Route path='/authfeedback'>
            <AuthFeedback>
              <LoginLink />
            </AuthFeedback>
          </Route>
        </RouteProvider>
      </ThemeProvider>
    </AppProvider>
  </div>,
  document.body
);
