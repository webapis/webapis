import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Suspense, lazy } from 'preact/compat';

import {FeatureRoute} from '../app-route/AppRouteProvider'
import {useNodeAuth} from './node-js-auth/useNodeAuth'
const Login = lazy(() => import('./Login'));
const ChangePassword = lazy(() => import('./ChangePassword'));
const ForgotPassword = lazy(() => import('./ForgotPassword'));
const Signup = lazy(() => import('./Signup'));
const Profile = lazy(() => import('./Profile'));
const AuthFeedback = lazy(() => import('./AuthFeedback'));
export default function NodeAuthentication({ children }) {
  const {signup,login,changePassword,forgotPassword}=useNodeAuth()


   


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
