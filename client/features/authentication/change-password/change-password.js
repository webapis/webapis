import 'whatwg-fetch';
import { h, render } from 'preact';
import ChangePassword from '../ChangePassword';
import { AuthProvider } from '../../auth/auth-context';
import { FormProvider } from '../../form/form-context';
import {AppRouteProvider,AppRoute} from '../../app-route/AppRouteProvider'
import { ThemeProvider } from '../../theme/theme-context';
import AuthFeedback, { LoginLink } from '../AuthFeedback';
render(
  <div>
    <FormProvider>
      <AuthProvider>
        <ThemeProvider
          initState={{
            primary: {
              background: '#6200EE',
              color: '#ffffff',
              fontFamily: 'Roboto, Helvetica, "Arial"',
            },
          }}
        >
          <AppRouteProvider initState={{route:'/',featureRoute:'/'}}>
            <AppRoute path='/'>
              <ChangePassword />
            </AppRoute>
            <AppRoute path='/authfeedback'>
              <AuthFeedback>
                <LoginLink />
              </AuthFeedback>
            </AppRoute>
          </AppRouteProvider>
        </ThemeProvider>
      </AuthProvider>
    </FormProvider>
  </div>,
  document.body
);
