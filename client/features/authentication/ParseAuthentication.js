import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Suspense, lazy } from 'preact/compat';

import {FeatureRoute} from 'components/app-route'
import {useParseAuth} from './services/parse/useParseAuth'
const Login = lazy(() => import('./ui-components/Login'));
const ChangePassword = lazy(() => import('./ui-components/ChangePassword'));
const ForgotPassword = lazy(() => import('./ui-components/ForgotPassword'));
const Signup = lazy(() => import('./ui-components/Signup'));
const Profile = lazy(() => import('./ui-components/Profile'));
const AuthFeedback = lazy(() => import('./ui-components/AuthFeedback'));
export default function ParseAuthentication({ children }) {
  const {signup,login,changePassword,forgotPassword}=useParseAuth()
  return (
    <div style={{paddingTop:68}}>
      <FeatureRoute path='/changepassword'>
        <Suspense fallback={<div>loading...</div>}>
          <ChangePassword changePassword={changePassword} />
        </Suspense>
      </FeatureRoute>
      <FeatureRoute path='/login'>
        <Suspense fallback={<div>loading...</div>}>
          <Login login={login}/>
        </Suspense>
      </FeatureRoute>

      <FeatureRoute path='/signup'>
        <Suspense fallback={<div>loading...</div>}>
          <Signup signup={signup}/>
        </Suspense>
      </FeatureRoute>

      <FeatureRoute path='/forgotpassword'>
        <Suspense fallback={<div>loading...</div>}>
          <ForgotPassword  forgotPassword={forgotPassword}/>
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
