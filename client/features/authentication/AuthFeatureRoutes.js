import { h } from 'preact'
import { Suspense, lazy } from 'preact/compat';
import { FeatureRoute } from 'components/app-route'
import {useAuth} from './state/useAuth'
const Login = lazy(() => import('./ui-components/Login'));
const ChangePassword = lazy(() => import('./ui-components/ChangePassword'));
const ForgotPassword = lazy(() => import('./ui-components/ForgotPassword'));
const Signup = lazy(() => import('./ui-components/Signup'));
const Profile = lazy(() => import('./ui-components/Profile'));

export default function AuthFeatureRoutes() {
  const {onLogin,onSignup,onRequestPasswordChange,onPasswordChange, onChange,state}=useAuth()
 
  return [
    <FeatureRoute path="/change-pasword">
      <Suspense fallback={<div>loading...</div>}>
        <ChangePassword {...state} onChange={onChange} onPasswordChange={onPasswordChange}/>
      </Suspense>
    </FeatureRoute>,
    <FeatureRoute path="/login">
      <Suspense fallback={<div>loading...</div>}>
        <Login {...state} onChange={onChange} onLogin={onLogin} />
      </Suspense>
    </FeatureRoute>,
    <FeatureRoute path="/signup">
      <Suspense fallback={<div>loading...</div>}>
        <Signup {...state}onChange={onChange}onSignup={onSignup} />
      </Suspense>
    </FeatureRoute>,
    <FeatureRoute path="/forgot-pasword">
      <Suspense fallback={<div>loading...</div>}>
        <ForgotPassword {...state} onChange={onChange} onRequestPasswordChange={onRequestPasswordChange}/>
      </Suspense>
    </FeatureRoute>,
    <FeatureRoute path="/profile">
      <Suspense fallback={<div>loading...</div>}>
        <Profile />
      </Suspense>
    </FeatureRoute>
  ]
}