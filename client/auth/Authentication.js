import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Suspense, lazy } from 'preact/compat';
import { AuthRoute } from './auth-route-context';

const Login = lazy(() => import('../auth/Login'));
const ChangePassword = lazy(() => import('../auth/ChangePassword'));
const ForgotPassword = lazy(() => import('../auth/ForgotPassword'));
const Signup = lazy(() => import('../auth/Signup'));
const Profile = lazy(() => import('../auth/Profile'));
const AuthFeedback = lazy(() => import('../auth/AuthFeedback'));
export default function Authentication({ children }) {
  return (
    <div>
      <AuthRoute path='/changepassword'>
        <Suspense fallback={<div>loading...</div>}>
          <ChangePassword />
        </Suspense>
      </AuthRoute>
      <AuthRoute path='/login'>
        <Suspense fallback={<div>loading...</div>}>
          <Login />
        </Suspense>
      </AuthRoute>

      <AuthRoute path='/signup'>
        <Suspense fallback={<div>loading...</div>}>
          <Signup />
        </Suspense>
      </AuthRoute>

      <AuthRoute path='/forgotpassword'>
        <Suspense fallback={<div>loading...</div>}>
          <ForgotPassword />
        </Suspense>
      </AuthRoute>

      <AuthRoute path='/profile'>
        <Suspense fallback={<div>loading...</div>}>
          <Profile />
        </Suspense>
      </AuthRoute>
      <AuthRoute path='/authfeedback'>
        <Suspense fallback={<div>loading...</div>}>
          <AuthFeedback />
        </Suspense>
      </AuthRoute>
    </div>
  );
}
