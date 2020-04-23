import { h } from 'preact';
import Input from '../form/Input';
import Form from '../form/Form';
import Button from '../form/Button';
import validationTypes from '../form/validationTypes';
import './css/style.css';
import { useAuthContext } from './auth-context';
import {useFormContext} from '../form/form-context'
import * as actions from './actions';
export default function RequestPassChange() {
  const { dispatch, state } = useAuthContext();
  const {dispatch:formDispatch}=useFormContext()
  const { email } = state;

  function handleForgotPassword() {
    dispatch(actions.forgotPassword({ dispatch, state,formDispatch }));
  }
  function handleChange(e) {
    const { name, value } = e.target;
    dispatch(actions.valueChanged({ propName: name, value, dispatch, state }));
  }
  return (
    <div data-testid="signupform" className="auth-form">
      <Form formTitle="Forgot Password">
        <Input
          value={email}
          placeholder="email"
          name="email"
          onChange={handleChange}
          type="email"
          id="email"
          validationTypes={[
            validationTypes.EMAIL_FORMAT_VALIDATION,
            validationTypes.EMAIL_NOT_REGISTERED,
          ]}
        />
        <Button
          className="btn"
          type="button"
          onClick={handleForgotPassword}
          id="requestpasschange-btn"
          title="Send"
        />
      </Form>
    </div>
  );
}
