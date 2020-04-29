import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import Input from '../form/Input';
import Form from '../form/Form';
import Button from '../form/Button';
import validationTypes from '../form/validationTypes';
import './css/style.css';
import { useAppContext } from '../app-context';
import * as actions from './actions';
import { useMediaQuery } from '../layout/useMediaQuery';
import { Paper } from '../layout/Paper';
import { Grid } from '../layout/Grid';
import { useRouteContext } from '../route/router';
export default function RequestPassChange() {
  const { form, auth } = useAppContext();
  const { state, dispatch } = auth;
  const [route, setRoute] = useRouteContext();
  const { device } = useMediaQuery();
  //const { dispatch, state } = useAuthContext();
  //const { dispatch: formDispatch } = useFormContext();
  const { email } = state;

  function handleForgotPassword() {
    dispatch(
      actions.forgotPassword({ dispatch, state, formDispatch: form.dispatch })
    );
  }
  function handleChange(e) {
    const { name, value } = e.target;
    dispatch(actions.valueChanged({ propName: name, value, dispatch, state }));
  }

  useEffect(() => {
    if (state.authFeedback) {
      debugger;
      setRoute('/authfeedback');
    }
  }, [state.authFeedback]);

  return (
    <Grid width={device === 'phone' ? 100 : 25}>
      <Paper>
        <Form formTitle='Forgot Password'>
          <Input
            value={email}
            placeholder='email'
            name='email'
            onChange={handleChange}
            type='email'
            id='email'
            validationTypes={[
              validationTypes.EMAIL_FORMAT_VALIDATION,
              validationTypes.EMAIL_NOT_REGISTERED,
            ]}
          />
          <Button
            className='btn'
            type='button'
            onClick={handleForgotPassword}
            id='requestpasschange-btn'
            title='Send'
          />
        </Form>
      </Paper>
    </Grid>
  );
}
