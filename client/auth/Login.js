import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import Input from '../form/Input';
import Button from '../form/Button';
import Form from '../form/Form';
import validationTypes from '../form/validationTypes';
import { useAuthContext } from './auth-context';
import {useFormContext} from '../form/form-context'
import { useMediaQuery } from '../layout/useMediaQuery';
import {useAppRoute} from '../app-route/AppRouteProvider'
import { Paper } from '../layout/Paper';
import { Grid } from '../layout/Grid';
import * as actions from './actions';

export default function Login() {
  const {onAppRoute} = useAppRoute();

  const { device } = useMediaQuery();
  const {state, dispatch} = useAuthContext();
  const {dispatch:formDispatch}=useFormContext()

  const { emailorusername, password, error } =state;

  useEffect(() => {
    if (state.token) {
    
      onAppRoute({featureRoute: '/',route:'/'});
    }
  }, [state.token]);

  function handleRoute(e) {
    e.preventDefault();
   
    onAppRoute({featureRoute: '/forgotpassword',route:'/auth'});
  }

  function handleChange(e) {
    const { name, value } = e.target;
    dispatch(
      actions.valueChanged({
        propName: name,
        value,
        dispatch,
        state,
      })
    );
  }
  function handleLogin() {
    dispatch(
      actions.login({
        dispatch,
        state,
        formDispatch
      })
    );
  }

  return (


 
    <Grid width={device === 'phone' ? 100 : 25}>
      <Paper>
        <Form formTitle='Login' error={error}>
          <Input
            value={emailorusername}
            onChange={handleChange}
            name='emailorusername'
            type='text'
            placeholder='Enter email or username'
            id='emailOrUsername'
            data-testid='emailOrUsername'
            validationTypes={[
              validationTypes.USERNAME_OR_EMAIL_FORMAT_VALIDATION,
              validationTypes.INVALID_CREDENTIALS,
              validationTypes.EMAIL_NOT_REGISTERED,
              validationTypes.USERNAME_NOT_REGISTERED,
            ]}
          />

          <Input
            value={password}
            onChange={handleChange}
            name='password'
            type='password'
            placeholder='enter password'
            id='password'
            data-testid='password'
            validationTypes={[
              validationTypes.EMPTY_STRING_VALIDATION,
              validationTypes.INVALID_CREDENTIALS,
            ]}
          />

          <Button
            type='button'
            id='login-btn'
            data-testid='login-btn'
            onClick={handleLogin}
            title='LOGIN'
          />
          <a href='/' onClick={handleRoute} id='forgotpassword' data-testid='forgotpassword'>
            Forgot Password!
          </a>
        </Form>
      </Paper>
    </Grid>
  );
}
