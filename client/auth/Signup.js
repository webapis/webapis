import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import './css/style.css';
import Form from '../form/Form';
import Input from '../form/Input';
import Button from '../form/Button';
import validationTypes from '../form/validationTypes';
import { useAuthContext } from './auth-context';
import { useFormContext } from '../form/form-context';
import * as actions from './actions';
import { Grid } from '../layout/Grid';
import { Paper } from '../layout/Paper';
import { useMediaQuery } from '../layout/useMediaQuery';
import { useRouteContext } from '../route/router';
export default function Signup() {
  const { state, dispatch } = useAuthContext();
  const { dispatch: formDispatch } = useFormContext();
  const [route, setRoute] = useRouteContext();
  const { device } = useMediaQuery();
  const { username, password, email } = state;
  useEffect(() => {
    if (state.token) {
      setRoute('/');
    }
  }, [state.token]);

  function handleSignup() {
    dispatch(
      actions.signup({
        dispatch,
        state,
        formDispatch,
      })
    );
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
  return (
    <Grid width={device === 'phone' ? 100 : 25}>
      <Paper>
        <Form formTitle='Sign up'>
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
          <Button
            className='btn'
            type='button'
            onClick={handleSignup}
            id='signup-btn'
            title='Signup'
          />
        </Form>
      </Paper>
    </Grid>
  );
}
