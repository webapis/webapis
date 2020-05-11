import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Suspense, lazy } from 'preact/compat';
import { Route } from '../route/router';
import { useAuthContext } from './auth-context';
import { recoverLocalAuthState } from '../auth/actions';
const Login = lazy(() => import('../auth/Login'));
const ChangePassword = lazy(() => import('../auth/ChangePassword'));
const ForgotPassword = lazy(() => import('../auth/ForgotPassword'));
const Signup = lazy(() => import('../auth/Signup'));
const Profile = lazy(() => import('../auth/Profile'));
const AuthFeedback = lazy(() => import('../auth/AuthFeedback'));
export default function Authentication() {
  const { dispatch } = useAuthContext();
  useEffect(() => {
    if (localStorage.getItem('webcom')) {
      recoverLocalAuthState({
        dispatch,
        user: JSON.parse(localStorage.getItem('webcom')),
      });
    }
  }, []);

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
