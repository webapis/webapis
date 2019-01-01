import { h } from 'preact';
import './css/style.css';
import Form from '../form/Form';
import Input from '../form/Input';
import Button from '../form/Button';
import validationTypes from '../form/validationTypes';
import { useAppContext } from '../app-context';
import * as actions from './actions';
export default function Signup() {
  const { form, auth } = useAppContext();
  const { username, password, email } = auth.state;

  function handleSignup() {
    auth.dispatch(
      actions.signup({
        dispatch: auth.dispatch,
        state: auth.state,
        formDispatch: form.dispatch,
      })
    );
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
