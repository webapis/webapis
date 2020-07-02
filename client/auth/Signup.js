import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import './css/style.css';
import Form from '../form/Form';
import Input from '../form/Input';
import Button from '../form/Button';
import AsyncButton from '../components/async-button'
import validationTypes from '../form/validationTypes';
import { useAuthContext } from './auth-context';
import { useFormContext } from '../form/form-context';
import * as actions from './actions';
import { Grid } from '../layout/Grid';
import { Paper } from '../layout/Paper';
import { useMediaQuery } from '../layout/useMediaQuery';
import {useAppRoute} from '../app-route/AppRouteProvider'
export default function Signup({signup}) {
  const {state,dispatch}=useAuthContext()
  const {onAppRoute} = useAppRoute();
  const { device } = useMediaQuery();
  const { username, password, email,loading,error } = state;
  useEffect(() => {
    if (state.user && state.user.token) {
      onAppRoute({featureRoute: '/',route:'/'});
    }
  }, [state.user]);

 
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
  return (
    <Grid width={device === 'phone' ? 100 : 25}>
      <Paper>
        <Form formTitle='Sign up' error={error}>
          <Input
            value={username}
            onChange={handleChange}
            type='text'
            id='username'
            name='username'
            placeholder='username'
            validationTypes={[
              validationTypes.USERNAME_FORMAT_VALIDATION,
              validationTypes.USERNAME_TAKEN,
              validationTypes.EMPTY_STRING_VALIDATION,
            ]}
          />
          <Input
            onChange={handleChange}
            value={email}
            placeholder='email'
            type='email'
            id='email'
            name='email'
            validationTypes={[
              validationTypes.EMAIL_FORMAT_VALIDATION,
              validationTypes.REGISTERED_EMAIL,
             
            ]}
          />
          <Input
            onChange={handleChange}
            value={password}
            placeholder='password'
            type='password'
            id='password'
            name='password'
            validationTypes={[validationTypes.PASSWORD_FORMAT_VALIDATION]}
          />
          <AsyncButton
            className='btn'
            type='button'
            onClick={signup}
            id='signup-btn'
            data-testid="signup-btn"
            loading={loading}
          >
            SIGNUP
          </AsyncButton>
        </Form>
      </Paper>
    </Grid>
  );
}
