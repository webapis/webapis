import { h } from 'preact';
import { Suspense, lazy } from 'preact/compat';


import { AuthProvider } from '../auth/auth-context';
import { Route, Link } from '../route/router';

const Login = lazy(() => import('../auth/Login'));
const ChangePassword = lazy(() => import('../auth/ChangePassword'));
const ForgotPassword = lazy(() => import('../auth/ForgotPassword'));
const Signup = lazy(() => import('../auth/Signup'));
export default function Authentication() {
  return (

      <AuthProvider>
    
          <Link to='/changepassword'>ChangePassword</Link>
          <Link to='/login'>Login</Link>
          <Link to='/signup'>Signup</Link>
          <Link to='/forgotpassword'>ForgotPassword</Link>
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
  
      </AuthProvider>
  
  );
}
