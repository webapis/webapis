import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import './css/style.css';

import AsyncButton from '../components/async-button'
import { useAuthContext } from '../state/auth-context';

import * as actions from '../state/actions';
import { Grid } from '../layout/Grid';
import { Paper } from '../layout/Paper';
import { useMediaQuery } from '../layout/useMediaQuery';
import {useAppRoute} from '../app-route/AppRouteProvider'
import TextInput from '../components/text-input'
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
    <Grid >
      <Paper>

          <TextInput
            value={username}
            onChange={handleChange}
            type='text'
            data-testid='username'
            name='username'
            placeholder='username'
            // validationTypes={[
            //   validationTypes.USERNAME_FORMAT_VALIDATION,
            //   validationTypes.USERNAME_TAKEN,
            //   validationTypes.EMPTY_STRING_VALIDATION,
            // ]}
          />
          <TextInput
            onChange={handleChange}
            value={email}
            placeholder='email'
            type='email'
            data-testid='email'
            name='email'
            // validationTypes={[
            //   validationTypes.EMAIL_FORMAT_VALIDATION,
            //   validationTypes.REGISTERED_EMAIL,
             
            // ]}
          />
          <TextInput
            onChange={handleChange}
            value={password}
            placeholder='password'
            type='password'
            data-testid='password'
            name='password'
            // validationTypes={[validationTypes.PASSWORD_FORMAT_VALIDATION]}
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
  
      </Paper>
    </Grid>
  );
}
