import { h } from 'preact';
import './css/style.css';
import Form from '../form/Form';
import Input from '../form/Input';
import Button from '../form/Button';
import validationTypes from '../form/validationTypes';
import { useAuthContext } from './auth-context';
import { useFormContext } from '../form/form-context';
import * as actions from './actions';
export default function Signup() {
  const { dispatch, state } = useAuthContext();
  const { dispatch: formDispatch } = useFormContext();
  const { username, password, email } = state;

  function handleSignup() {
    dispatch(actions.signup({ dispatch, state,formDispatch }));
  }
  function handleChange(e) {
    const { name, value } = e.target;
    dispatch(actions.valueChanged({ propName: name, value, dispatch, state }));
  }
  return (
    <div data-testid="signupform" className="auth-form">
      <Form formTitle="Sign up">
        <Input
          value={username}
          onChange={handleChange}
          type="text"
          id="username"
          name="username"
          placeholder="username"
          validationTypes={[
            validationTypes.USERNAME_FORMAT_VALIDATION,
            validationTypes.USERNAME_TAKEN,
          ]}
        />
        <Input
          onChange={handleChange}
          value={email}
          placeholder="email"
          type="email"
          id="email"
          name="email"
          validationTypes={[
            validationTypes.EMAIL_FORMAT_VALIDATION,
            validationTypes.REGISTERED_EMAIL,
          ]}
        />
        <Input
          onChange={handleChange}
          value={password}
          placeholder="password"
          type="password"
          id="password"
          name="password"
          validationTypes={[validationTypes.PASSWORD_FORMAT_VALIDATION]}
        />
        <Button
          className="btn"
          type="button"
          onClick={handleSignup}
          id="signup-btn"
          title="Signup"
        />
      </Form>
    </div>
  );
}
