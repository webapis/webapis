import { h, render } from 'preact';
//import { Suspense, lazy } from 'preact/compat';
import { html } from 'htm/preact';
import TestComponent from './TestComponent';
import { AppProvider } from './app-context';
import { AuthProvider } from './auth/auth-context';
import { RouteProvider, Route, Link } from './route/route-context';
import Login from './auth/Login';
import Signup from './auth/Signup';
import ForgotPassword from './auth/ForgotPassword';
import ChangePassword from './auth/ChangePassword';
// const Login = lazy(() => import('./auth/Login'));
// const ChangePassword = lazy(() => import('./auth/ChangePassword'));
// const ForgotPassword = lazy(() => import('./auth/ForgotPassword'));
// const Signup = lazy(() => import('./auth/Signup'));

render(
  <AppProvider>
    <AuthProvider>
      <RouteProvider>
        <Link to="#/changepassword">ChangePassword</Link>
        <Link to="#/login">Login</Link>
        <Link to="#/signup">Signup</Link>
        <Link to="#/forgotpassword">ForgotPassword</Link>
        <Route path="#/changepassword">
          <ChangePassword />
        </Route>
        <Route path="#/login">
          <Login />
        </Route>
        <Route path="#/signup">
          <Signup />
        </Route>
        <Route path="#/forgotpassword">
          <ForgotPassword />
        </Route>
      </RouteProvider>
    </AuthProvider>
  </AppProvider>,
  document.getElementById('app')
);
