import { h } from 'preact';
import './css/style.css';
import Input from '../form/Input';
import Button from '../form/Button';
import Form from '../form/Form';
import validationTypes from '../form/validationTypes';
import { useAuthContext } from './auth-context';
import * as actions from './actions';
export default function Login() {
  const { dispatch, state } = useAuthContext();

  const { emailorusername, password, error } = state;

  function handleChange(e) {
    const { name, value } = e.target;
    dispatch(actions.valueChanged({ propName:name, value, dispatch, state }));
  }
  function handleLogin() {
    dispatch(actions.login({ dispatch, state }));
  }

  return (
    <div data-testid="loginform" className="auth-form">
      <Form formTitle="Login" error={error}>
        <Input
          value={emailorusername}
          onChange={handleChange}
          name="emailorusername"
          type="text"
          placeholder="Enter email or username"
          id="emailOrUsername"
          data-testid="emailOrUsername"
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
          name="password"
          type="password"
          placeholder="enter password"
          id="password"
          data-testid="password"
          validationTypes={[
            validationTypes.EMPTY_STRING_VALIDATION,
            validationTypes.INVALID_CREDENTIALS,
          ]}
        />

        <Button
          type="button"
          id="login-btn"
          data-testid="login-btn"
          onClick={handleLogin}
          title="Login"
        />
        <a href="#/requestpasschange">Forgot Password!</a>
      </Form>
    </div>
  );
}
