import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import Input from '../form/Input';
import Button from '../form/Button';
import Form from '../form/Form';
import validationTypes from '../form/validationTypes';
import { useAppContext } from '../app-context';
import { useMediaQuery } from '../layout/useMediaQuery';
import { useRouteContext } from '../route/router';
import { Paper } from '../layout/Paper';
import { Grid } from '../layout/Grid';
import * as actions from './actions';

export default function Login() {
  const [route, setRoute] = useRouteContext();
  const { device } = useMediaQuery();
  const { auth, form } = useAppContext();

  const { emailorusername, password, error } = auth.state;

  useEffect(() => {
    if (auth.state.token) {
      setRoute('/');
    }
  }, [auth.state.token]);

  function handleRoute(e) {
    e.preventDefault();
    const { id } = e.target;
    setRoute(`/${id}`);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    auth.dispatch(
      actions.valueChanged({
        propName: name,
        value,
        dispatch: auth.dispatch,
        state: auth.state,
      })
    );
  }
  function handleLogin() {
    auth.dispatch(
      actions.login({
        dispatch: auth.dispatch,
        state: auth.state,
        formDispatch: form.dispatch,
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
          <a href='/' onClick={handleRoute} id='forgotpassword'>
            Forgot Password!
          </a>
        </Form>
      </Paper>
    </Grid>
  );
}
