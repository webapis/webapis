import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Suspense, lazy } from 'preact/compat';

import {FeatureRoute} from '../app-route/AppRouteProvider'
const Login = lazy(() => import('../auth/Login'));
const ChangePassword = lazy(() => import('../auth/ChangePassword'));
const ForgotPassword = lazy(() => import('../auth/ForgotPassword'));
const Signup = lazy(() => import('../auth/Signup'));
const Profile = lazy(() => import('../auth/Profile'));
const AuthFeedback = lazy(() => import('../auth/AuthFeedback'));
export default function Authentication({ children }) {
  return (
    <div>
      <FeatureRoute path='/changepassword'>
        <Suspense fallback={<div>loading...</div>}>
          <ChangePassword />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute path='/login'>
        <Suspense fallback={<div>loading...</div>}>
          <Login />
        </Suspense>
      </FeatureRoute>

      <FeatureRoute path='/signup'>
        <Suspense fallback={<div>loading...</div>}>
          <Signup />
        </Suspense>
      </FeatureRoute>

      <FeatureRoute path='/forgotpassword'>
        <Suspense fallback={<div>loading...</div>}>
          <ForgotPassword />
        </Suspense>
      </FeatureRoute>

      <FeatureRoute path='/profile'>
        <Suspense fallback={<div>loading...</div>}>
          <Profile />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute path='/authfeedback'>
        <Suspense fallback={<div>loading...</div>}>
          <AuthFeedback />
        </Suspense>
      </FeatureRoute>
    </div>
  );
}
