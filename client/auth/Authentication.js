import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import { Route } from '../route/router';
const Login = lazy(() => import('../auth/Login'));
const ChangePassword = lazy(() => import('../auth/ChangePassword'));
const ForgotPassword = lazy(() => import('../auth/ForgotPassword'));
const Signup = lazy(() => import('../auth/Signup'));
const Profile = lazy(() => import('../auth/Profile'));
const AuthFeedback = lazy(() => import('../auth/AuthFeedback'));
export default function Authentication() {
  return (
    <div>
      <Route path='/changepassword'>
        <Suspense fallback={<div>loading...</div>}>
          <ChangePassword />
        </Suspense>
      </Route>

      <Route path='/login'>
        <Suspense fallback={<div>loading...</div>}>
          <Login />
        </Suspense>
      </Route>

      <Route path='/signup'>
        <Suspense fallback={<div>loading...</div>}>
          <Signup />
        </Suspense>
      </Route>

      <Route path='/forgotpassword'>
        <Suspense fallback={<div>loading...</div>}>
          <ForgotPassword />
        </Suspense>
      </Route>

      <Route path='/profile'>
        <Suspense fallback={<div>loading...</div>}>
          <Profile />
        </Suspense>
      </Route>
      <Route path='/authfeedback'>
        <Suspense fallback={<div>loading...</div>}>
          <AuthFeedback />
        </Suspense>
      </Route>
    </div>
  );
}
